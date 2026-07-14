// COURSES est accédé directement depuis le scope global défini par db.js

// Supabase Configuration (Burkina Faso HSE Platform Backend)
const SUPABASE_URL = "https://gzhuvxdsosxfcqpmqoka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aHV2eGRzb3N4ZmNxcG1xb2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTY4MjksImV4cCI6MjA5OTU5MjgyOX0.DsCpEiasObax_mi2QzhMs9h5mhnznF4gARPmFgCReyg";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Unique UUID helper for mockup certificates
function generateUUID() {
    return 'cert-' + Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9);
}

// Initial default state
const DEFAULT_STATE = {
    user: null, // Connected user
    progress: {}, // Format: { courseId: { completedLessons: [lessonIds], passedQuizzes: [moduleIds], examAttempts: [scores], completed: false, certificateId: null } }
    certificates: {}, // Format: { certId: { studentName, courseId, courseTitle, date, uuid, score } }
    customCourses: [] // Dynamic administrator courses
};

class Store {
    constructor() {
        this.state = DEFAULT_STATE;
        this.listeners = [];
        this.init();
        this.setupSupabaseListener();
    }

    init() {
        const stored = localStorage.getItem('fasoclassroom_store');
        if (stored) {
            try {
                const parsed = JSON.parse(stored) || {};
                this.state = {
                    user: parsed.user !== undefined ? parsed.user : null,
                    progress: parsed.progress || {},
                    certificates: parsed.certificates || {},
                    customCourses: parsed.customCourses || []
                };
            } catch (e) {
                console.error("Erreur lors de la lecture du LocalStorage", e);
                this.state = DEFAULT_STATE;
            }
        }
    }

    setupSupabaseListener() {
        if (!supabaseClient) return;
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (session && session.user) {
                await this.syncSupabaseUser(session.user);
            } else {
                this.state.user = null;
                this.save();
            }
        });
    }

    async syncSupabaseUser(sbUser) {
        try {
            // 1. Fetch Profile Details
            let { data: profile, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', sbUser.id)
                .maybeSingle();
                
            if (!profile) {
                // If profile missing, insert it
                profile = {
                    id: sbUser.id,
                    email: sbUser.email,
                    name: sbUser.email.split('@')[0],
                    role: 'Étudiant',
                    has_paid: false
                };
                await supabaseClient.from('profiles').insert(profile);
            }
            
            this.state.user = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                hasPaid: profile.has_paid
            };
            
            // 2. Fetch Progress Details
            const { data: dbProgress } = await supabaseClient
                .from('course_progress')
                .select('*')
                .eq('user_id', sbUser.id);
                
            if (dbProgress && dbProgress.length > 0) {
                dbProgress.forEach(row => {
                    this.state.progress[row.course_id] = {
                        completedLessons: row.completed_lessons || [],
                        passedQuizzes: row.passed_quizzes || [],
                        examAttempts: [],
                        completed: row.completed || false,
                        certificateId: row.certificate_id || null
                    };
                });
            } else {
                // Push local progress if empty on DB
                await this.pushLocalProgressToSupabase(sbUser.id);
            }
            
            // 3. Fetch Certificates Details
            const { data: dbCerts } = await supabaseClient
                .from('certificates')
                .select('*')
                .eq('user_id', sbUser.id);
                
            if (dbCerts) {
                dbCerts.forEach(c => {
                    this.state.certificates[c.id] = {
                        uuid: c.id,
                        studentName: c.student_name,
                        courseId: c.course_id,
                        courseTitle: c.course_title,
                        date: c.date,
                        score: c.score
                    };
                });
            }
            
            this.save();
        } catch (e) {
            console.error("Error syncing with Supabase:", e);
        }
    }

    async pushLocalProgressToSupabase(userId) {
        if (!supabaseClient) return;
        for (const [courseId, p] of Object.entries(this.state.progress)) {
            await supabaseClient.from('course_progress').upsert({
                user_id: userId,
                course_id: courseId,
                completed_lessons: p.completedLessons,
                passed_quizzes: p.passedQuizzes,
                completed: p.completed,
                certificate_id: p.certificateId
            });
        }
    }

    async pushCourseProgress(courseId) {
        if (!supabaseClient || !this.state.user || !this.state.user.id) return;
        const p = this.state.progress[courseId];
        if (!p) return;
        try {
            await supabaseClient.from('course_progress').upsert({
                user_id: this.state.user.id,
                course_id: courseId,
                completed_lessons: p.completedLessons,
                passed_quizzes: p.passedQuizzes,
                completed: p.completed,
                certificate_id: p.certificateId
            });
        } catch (e) {
            console.error("Failed to push course progress:", e);
        }
    }

    async pushCertificateToSupabase(cert) {
        if (!supabaseClient || !this.state.user || !this.state.user.id) return;
        try {
            await supabaseClient.from('certificates').insert({
                id: cert.uuid,
                student_name: cert.studentName,
                course_id: cert.courseId,
                course_title: cert.courseTitle,
                date: cert.date,
                score: cert.score,
                user_id: this.state.user.id
            });
        } catch (e) {
            console.error("Failed to push certificate:", e);
        }
    }

    save() {
        localStorage.setItem('fasoclassroom_store', JSON.stringify(this.state));
        this.notify();
    }

    getCourses() {
        if (!this.state.deletedCourseIds) {
            this.state.deletedCourseIds = [];
        }
        if (!this.state.customCourses) {
            this.state.customCourses = [];
        }
        const preloaded = COURSES.filter(c => 
            !this.state.customCourses.some(cc => cc.id === c.id) &&
            !this.state.deletedCourseIds.includes(c.id)
        );
        const customs = this.state.customCourses.filter(cc => 
            !this.state.deletedCourseIds.includes(cc.id)
        );
        return [...preloaded, ...customs];
    }

    addCourse(course) {
        if (!this.state.customCourses) {
            this.state.customCourses = [];
        }
        if (this.state.deletedCourseIds) {
            this.state.deletedCourseIds = this.state.deletedCourseIds.filter(id => id !== course.id);
        }
        const idx = this.state.customCourses.findIndex(cc => cc.id === course.id);
        if (idx !== -1) {
            this.state.customCourses[idx] = course;
        } else {
            this.state.customCourses.push(course);
        }
        this.save();
    }

    deleteCourse(courseId) {
        if (!this.state.deletedCourseIds) {
            this.state.deletedCourseIds = [];
        }
        if (!this.state.deletedCourseIds.includes(courseId)) {
            this.state.deletedCourseIds.push(courseId);
        }
        if (this.state.customCourses) {
            this.state.customCourses = this.state.customCourses.filter(cc => cc.id !== courseId);
        }
        this.save();
    }

    getMockStudentsData() {
        const currentUser = this.getCurrentUser();
        const currentUserName = currentUser ? currentUser.name : "Jean Dupont";
        const currentUserEmail = currentUser ? currentUser.email : "jean.dupont@example.com";

        const studentCoursesProgress = {};
        this.getCourses().forEach(c => {
            studentCoursesProgress[c.id] = {
                title: c.title,
                progress: this.getCourseProgress(c.id),
                completed: this.getCourseState(c.id)?.completed || false,
                examAttempts: this.getCourseState(c.id)?.examAttempts || [],
                passedQuizzes: this.getCourseState(c.id)?.passedQuizzes || []
            };
        });

        return [
            {
                id: "stud-1",
                name: currentUserName,
                email: currentUserEmail,
                role: "Étudiant (Vous)",
                courses: studentCoursesProgress
            },
            {
                id: "stud-2",
                name: "Marie Martin",
                email: "marie.martin@example.com",
                role: "Étudiant",
                courses: {
                    "course-air": {
                        title: "Méthodes d'analyse de la qualité de l'air",
                        progress: 100,
                        completed: true,
                        examAttempts: [0.8],
                        passedQuizzes: ["quiz-air-mod1"]
                    },
                    "course-noise": {
                        title: "Méthode d'analyse de la qualité du bruit et des vibrations",
                        progress: 50,
                        completed: false,
                        examAttempts: [],
                        passedQuizzes: []
                    }
                }
            },
            {
                id: "stud-3",
                name: "Lucas Bernard",
                email: "lucas.bernard@example.com",
                role: "Étudiant",
                courses: {
                    "course-air": {
                        title: "Méthodes d'analyse de la qualité de l'air",
                        progress: 16,
                        completed: false,
                        examAttempts: [],
                        passedQuizzes: []
                    },
                    "course-safety": {
                        title: "Normes et standards santé sécurité au travail",
                        progress: 100,
                        completed: true,
                        examAttempts: [0.95],
                        passedQuizzes: ["quiz-safety-mod1"]
                    }
                }
            }
        ];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // --- Authentication ---
    getCurrentUser() {
        return this.state.user;
    }

    async checkEmailExists(email) {
        if (!supabaseClient) return false;
        try {
            const { data } = await supabaseClient
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();
            return data !== null;
        } catch (e) {
            console.error("Failed to check email status in Supabase:", e);
            return false;
        }
    }

    async signInUser(email, password) {
        if (!supabaseClient) {
            // Offline/Mock fallback
            this.loginMockUser(email.split('@')[0], email);
            return { user: this.state.user };
        }
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        await this.syncSupabaseUser(data.user);
        return { user: this.state.user };
    }

    async signUpUser(email, password, name, role) {
        if (!supabaseClient) {
            // Offline/Mock fallback
            this.loginMockUser(name, email);
            this.state.user.role = role;
            this.save();
            return { user: this.state.user };
        }
        
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: role
                }
            }
        });
        if (error) throw error;
        
        await this.syncSupabaseUser(data.user);
        return { user: this.state.user };
    }

    loginMockUser(name = "Jean Dupont", email = "jean.dupont@example.com") {
        this.state.user = { name, email, hasPaid: false };
        
        // Initialize progress for all courses if not existing
        this.getCourses().forEach(c => {
            if (!this.state.progress[c.id]) {
                this.state.progress[c.id] = {
                    completedLessons: [],
                    passedQuizzes: [],
                    examAttempts: [],
                    completed: false,
                    certificateId: null
                };
            }
        });
        
        this.save();
    }

    hasPaid() {
        return this.state.user && this.state.user.hasPaid;
    }

    async setPaid(status) {
        if (this.state.user) {
            this.state.user.hasPaid = status;
            this.save();
            
            if (supabaseClient && this.state.user.id) {
                try {
                    await supabaseClient
                        .from('profiles')
                        .update({ has_paid: status })
                        .eq('id', this.state.user.id);
                } catch (e) {
                    console.error("Failed to push payment status to Supabase:", e);
                }
            }
        }
    }

    async logout() {
        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }
        this.state.user = null;
        this.save();
    }

    // --- Course Progression Logic ---
    getCourseProgress(courseId) {
        const p = this.state.progress[courseId];
        if (!p) return 0;
        
        const course = this.getCourses().find(c => c.id === courseId);
        if (!course) return 0;

        // Calculate total lessons
        let total = 0;
        course.modules.forEach(m => {
            m.chapters.forEach(ch => {
                total += ch.lessons.length;
            });
        });

        if (total === 0) return 0;
        const percent = Math.round((p.completedLessons.length / total) * 100);
        return percent;
    }

    getCourseState(courseId) {
        if (!this.state.progress[courseId]) {
            this.state.progress[courseId] = {
                completedLessons: [],
                passedQuizzes: [],
                examAttempts: [],
                completed: false,
                certificateId: null
            };
            this.save();
        }
        return this.state.progress[courseId];
    }

    // Check progressive unlock rules
    isLessonUnlocked(courseId, lessonId) {
        const p = this.state.progress[courseId];
        if (!p) return false;

        const course = this.getCourses().find(c => c.id === courseId);
        if (!course) return false;

        // Linearize all lessons and their modules in order
        const flatLessons = [];
        course.modules.forEach(m => {
            m.chapters.forEach(ch => {
                ch.lessons.forEach(l => {
                    flatLessons.push({
                        lessonId: l.id,
                        moduleId: m.id,
                        quizId: m.quiz?.quizId
                    });
                });
            });
        });

        const targetIndex = flatLessons.findIndex(item => item.lessonId === lessonId);
        if (targetIndex === -1) return false;
        
        // First lesson is always unlocked
        if (targetIndex === 0) return true;

        // Otherwise, the immediate previous lesson must be completed
        const prevItem = flatLessons[targetIndex - 1];
        const isPrevCompleted = p.completedLessons.includes(prevItem.lessonId);
        if (!isPrevCompleted) return false;

        // If the module changed, check if the previous module's quiz was passed
        if (prevItem.moduleId !== flatLessons[targetIndex].moduleId) {
            const hasPassedPrevQuiz = p.passedQuizzes.includes(prevItem.moduleId);
            if (!hasPassedPrevQuiz) return false;
        }

        return true;
    }

    markLessonComplete(courseId, lessonId) {
        const p = this.state.progress[courseId];
        if (!p) return;

        if (!p.completedLessons.includes(lessonId)) {
            p.completedLessons.push(lessonId);
            this.save();
            this.pushCourseProgress(courseId);
        }
    }

    // --- Quizzes ---
    submitQuizResult(courseId, moduleId, passed) {
        const p = this.state.progress[courseId];
        if (!p) return;

        if (passed) {
            if (!p.passedQuizzes.includes(moduleId)) {
                p.passedQuizzes.push(moduleId);
                this.save();
                this.pushCourseProgress(courseId);
            }
        }
    }

    hasPassedQuiz(courseId, moduleId) {
        const p = this.state.progress[courseId];
        return p ? p.passedQuizzes.includes(moduleId) : false;
    }

    // --- Secure Final Exam ---
    submitExamResult(courseId, scoreFraction) {
        const p = this.state.progress[courseId];
        if (!p) return false;

        const course = this.getCourses().find(c => c.id === courseId);
        if (!course) return false;

        p.examAttempts.push(scoreFraction);

        const isPassed = scoreFraction >= course.exam.passingScore;
        if (isPassed && !p.completed) {
            p.completed = true;
            // Generate a certificate
            const certId = generateUUID();
            p.certificateId = certId;

            // Store certificate details
            const certData = {
                uuid: certId,
                studentName: this.state.user.name,
                courseId: course.id,
                courseTitle: course.title,
                date: new Date().toLocaleDateString('fr-FR'),
                score: Math.round(scoreFraction * 100)
            };
            this.state.certificates[certId] = certData;
            this.pushCertificateToSupabase(certData);
        }
        this.save();
        this.pushCourseProgress(courseId);
        return isPassed;
    }

    // --- Certificates ---
    getCertificate(certId) {
        return this.state.certificates[certId] || null;
    }

    getAllStudentCertificates() {
        if (!this.state.user) return [];
        return Object.values(this.state.certificates).filter(
            c => c.studentName === this.state.user.name
        );
    }

    async getRealStudentsData() {
        if (!supabaseClient) return this.getMockStudentsData();
        try {
            // Fetch all profiles
            const { data: profiles } = await supabaseClient
                .from('profiles')
                .select('*');
                
            if (!profiles) return this.getMockStudentsData();
            
            // Fetch all progressions
            const { data: progresses } = await supabaseClient
                .from('course_progress')
                .select('*');
                
            const result = [];
            
            for (const profile of profiles) {
                // Ignore admin/trainer profiles in the student list
                if (profile.role === 'Formateur') continue;
                
                const studentCoursesProgress = {};
                this.getCourses().forEach(c => {
                    const studentProg = progresses ? progresses.find(p => p.user_id === profile.id && p.course_id === c.id) : null;
                    
                    let percent = 0;
                    if (studentProg && studentProg.completed_lessons) {
                        const totalLessons = c.modules.reduce((acc, m) => acc + m.chapters.reduce((acc2, ch) => acc2 + ch.lessons.length, 0), 0);
                        if (totalLessons > 0) {
                            percent = Math.round((studentProg.completed_lessons.length / totalLessons) * 100);
                        }
                    }
                    
                    studentCoursesProgress[c.id] = {
                        title: c.title,
                        progress: percent,
                        completed: studentProg ? studentProg.completed : false,
                        examAttempts: studentProg ? (studentProg.completed ? [1.0] : []) : [],
                        passedQuizzes: studentProg ? studentProg.passed_quizzes || [] : []
                    };
                });
                
                result.push({
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    hasPaid: profile.has_paid,
                    courses: studentCoursesProgress
                });
            }
            
            return result;
        } catch (e) {
            console.error("Failed to load real student data:", e);
            return this.getMockStudentsData();
        }
    }

    async createBOUser(name, email, password, role, hasPaid) {
        if (!supabaseClient) {
            alert("Mode hors-ligne : Création simulée localement.");
            return;
        }
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: role
                }
            }
        });
        if (error) throw error;

        if (hasPaid && data.user) {
            const { error: updateErr } = await supabaseClient
                .from('profiles')
                .update({ has_paid: true })
                .eq('id', data.user.id);
            if (updateErr) console.error("Error setting initial payment status:", updateErr);
        }
    }

    async updateBOUser(userId, name, role, hasPaid) {
        if (!supabaseClient) {
            alert("Mode hors-ligne : Modification simulée localement.");
            return;
        }
        const { error } = await supabaseClient
            .from('profiles')
            .update({
                name: name,
                role: role,
                has_paid: hasPaid
            })
            .eq('id', userId);
        if (error) throw error;
    }

    async deleteBOUser(userId) {
        if (!supabaseClient) {
            alert("Mode hors-ligne : Suppression simulée localement.");
            return;
        }
        const { error } = await supabaseClient
            .from('profiles')
            .delete()
            .eq('id', userId);
        if (error) throw error;
    }
}

const store = new Store();
window.store = store;
window.appStore = store;
