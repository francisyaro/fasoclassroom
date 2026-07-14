const COURSES = [
    {
        id: "course-air",
        title: "Méthodes d'analyse de la qualité de l'air",
        description: "Apprenez à prélever, quantifier et interpréter la présence des polluants atmosphériques (particules fines, NOx, COV) selon les réglementations nationales et internationales.",
        level: "intermediate",
        levelText: "Intermédiaire",
        duration: "10 heures",
        lessonsCount: 6,
        modules: [
            {
                id: "air-mod1",
                title: "Prélèvement et échantillonnage de l'air",
                description: "Maîtrisez les techniques de capture passives et actives des composés gazeux et particulaires.",
                chapters: [
                    {
                        id: "air-m1-c1",
                        title: "Introduction et Échantillonnage passif",
                        lessons: [
                            {
                                id: "air-m1-c1-l1",
                                title: "Introduction à la métrologie de la qualité de l'air",
                                type: "video",
                                duration: "8 min",
                                videoUrl: "https://www.youtube.com/embed/l8mBPCz2Tio",
                                content: "Introduction aux enjeux de la surveillance de la qualité de l'air, définitions des polluants réglementés et panorama général des méthodes de mesure."
                            },
                            {
                                id: "air-m1-c1-l2",
                                title: "Principes de l'échantillonnage passif",
                                type: "document",
                                duration: "15 min",
                                documentUrl: "prelevement_passif.pdf",
                                content: `
                                    <h2>Échantillonnage passif par tubes à diffusion</h2>
                                    <p>L'échantillonnage passif repose sur le transfert de molécules de gaz par diffusion moléculaire vers un support adsorbant, sans apport d'énergie (aucune pompe active).</p>
                                    <h3>Avantages principaux :</h3>
                                    <ul>
                                        <li>Économique et facile à déployer en grand nombre sur le terrain.</li>
                                        <li>Idéal pour obtenir des concentrations moyennes sur de longues périodes (ex: de 1 à 4 semaines).</li>
                                        <li>Ne nécessite aucune alimentation électrique.</li>
                                    </ul>
                                    <h3>Loi physique sous-jacente (Loi de Fick) :</h3>
                                    <p>Le débit de diffusion <code>J</code> est proportionnel au gradient de concentration : <code>J = D * (A / L) * (C_ext - C_int)</code></p>
                                `
                            }
                        ]
                    },
                    {
                        id: "air-m1-c2",
                        title: "Échantillonnage actif & Règles d'implantation",
                        lessons: [
                            {
                                id: "air-m1-c2-l1",
                                title: "Principes du prélèvement actif",
                                type: "document",
                                duration: "12 min",
                                documentUrl: "prelevement_actif.pdf",
                                content: `
                                    <h2>Échantillonnage actif (pompes à débit régulé)</h2>
                                    <p>Contrairement aux tubes passifs, le prélèvement actif force le passage de l'air à travers un milieu de collecte (filtre, cartouche d'adsorption ou barboteur) à un débit contrôlé.</p>
                                    <h3>Critères opérationnels clés :</h3>
                                    <ul>
                                        <li><strong>Débit :</strong> Mesuré et étalonné avant et après chaque période de prélèvement.</li>
                                        <li><strong>Température et pression :</strong> Enregistrées en continu pour corriger le volume d'air prélevé aux conditions de référence.</li>
                                        <li><strong>Isocinétisme :</strong> Indispensable pour l'échantillonnage de particules dans les conduits ou flux d'air rapides.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "air-m1-c2-l2",
                                title: "Exercice : Détermination de la hauteur minimale d'aspiration",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Hauteur réglementaire de la tête d'aspiration</h2>
                                    <p>Pour assurer la représentativité des prélèvements de l'air ambiant et éviter les interférences du sol immédiat, la réglementation définit une hauteur minimale de prélèvement.</p>
                                    <p><strong>Votre objectif :</strong> Écrivez l'instruction permettant de fixer la variable HAUTEUR_MIN à la hauteur minimale réglementaire recommandée (qui est de 1.5 mètres).</p>
                                `,
                                starterCode: `// Fixez la hauteur d'aspiration minimale à 1.5 mètres\n// Écrivez votre code ci-dessous (ex: HAUTEUR_MIN = ...)\n\n`,
                                solutionPattern: "HAUTEUR_MIN\\s*=\\s*1\\.5",
                                hint: "Utilisez l'écriture standard : HAUTEUR_MIN = 1.5"
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-air-mod1",
                    title: "Validation : Prélèvement et Échantillonnage",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-air-1",
                            text: "Quelle loi physique régit le fonctionnement des tubes d'échantillonnage passif ?",
                            options: [
                                "La loi d'Ohm",
                                "La loi de Fick",
                                "La loi des gaz parfaits",
                                "Le principe de Bernoulli"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-air-2",
                            text: "Quel paramètre est indispensable pour un prélèvement particulaire représentatif en conduit ?",
                            options: [
                                "La chimiluminescence",
                                "Le maintien des conditions isocinétiques",
                                "L'ionisation de flamme",
                                "L'absence totale d'humidité"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            },
            {
                id: "air-mod2",
                title: "Analyse physico-chimique des polluants",
                description: "Techniques de laboratoire pour la quantification des molécules chimiques.",
                chapters: [
                    {
                        id: "air-m2-c1",
                        title: "Analyses de laboratoire et chromatographie",
                        lessons: [
                            {
                                id: "air-m2-c1-l1",
                                title: "Dosage des COV par GC-MS",
                                type: "document",
                                duration: "20 min",
                                documentUrl: "gc_ms_cov.pdf",
                                content: `
                                    <h2>Chromatographie en Phase Gazeuse (GC) et Spectrométrie de Masse (MS)</h2>
                                    <p>La GC-MS est la méthode de référence pour l'analyse des Composés Organiques Volatils (COV) capturés sur les tubes à diffusion.</p>
                                    <h3>Phases analytiques :</h3>
                                    <ol>
                                        <li><strong>Désorption thermique :</strong> Le tube est chauffé pour libérer les COV vers l'injecteur chromatographique.</li>
                                        <li><strong>Séparation (GC) :</strong> Les molécules sont séparées sur une colonne capillaire en fonction de leur volatilité et affinité chimique.</li>
                                        <li><strong>Détection (MS) :</strong> Les molécules sont ionisées, séparées selon leur ratio masse/charge (m/z) et identifiées via une bibliothèque spectrale.</li>
                                    </ol>
                                `
                            },
                            {
                                id: "air-m2-c1-l2",
                                title: "Analyse en continu par chimiluminescence",
                                type: "document",
                                duration: "15 min",
                                documentUrl: "nox_chimiluminescence.pdf",
                                content: `
                                    <h2>Dosage des NOx par chimiluminescence</h2>
                                    <p>Cette méthode est utilisée pour le suivi en continu du Monoxyde d'Azote (NO) et du Dioxyde d'Azote (NO2).</p>
                                    <p>Le NO réagit avec l'ozone (O3) pour former du NO2 dans un état excité, qui retourne à l'état fondamental en émettant une lumière détectable par un photomultiplicateur. Pour mesurer le NO2, on le réduit d'abord en NO à l'aide d'un convertisseur à haute température.</p>
                                `
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-air-mod2",
                    title: "Validation : Analyse Analytique",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-air3",
                            text: "Quel détecteur est couplé à la chromatographie gazeuse pour identifier précisément les polluants par leur rapport masse/charge ?",
                            options: [
                                "Le spectromètre de masse (MS)",
                                "L'ionisation de flamme (FID)",
                                "La capture d'électrons (ECD)",
                                "L'absorption infrarouge"
                            ],
                            correctIndex: 0
                        }
                    ]
                }
            }
        ],
        exam: {
            title: "Examen de Certification - Qualité de l'Air",
            timeLimit: 1200,
            passingScore: 0.7,
            questions: [
                {
                    question: "Quelle loi physique régit le fonctionnement des tubes d'échantillonnage passif ?",
                    options: [
                        "La loi d'Ohm",
                        "La loi de Fick",
                        "La loi des gaz parfaits",
                        "Le principe de Bernoulli"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Quel détecteur est couplé à la chromatographie gazeuse pour identifier précisément les polluants par leur rapport masse/charge ?",
                    options: [
                        "Le spectromètre de masse (MS)",
                        "L'ionisation de flamme (FID)",
                        "La capture d'électrons (ECD)",
                        "L'absorption infrarouge"
                    ],
                    correctIndex: 0
                }
            ]
        }
    },
    {
        id: "course-noise",
        title: "Méthode d'analyse de la qualité du bruit et des vibrations",
        description: "Maîtrisez la mesure du bruit environnemental et des vibrations en milieu de travail : utilisation du sonomètre, analyse spectrale et calcul de l'exposition quotidienne.",
        level: "intermediate",
        levelText: "Intermédiaire",
        duration: "8 heures",
        lessonsCount: 4,
        modules: [
            {
                id: "noise-mod1",
                title: "Métrologie acoustique et mesures physiques",
                description: "Comprenez la physique du bruit et les réglages métrologiques nécessaires pour collecter des données conformes.",
                chapters: [
                    {
                        id: "noise-m1-c1",
                        title: "Les fondamentaux physiques et la décibel",
                        lessons: [
                            {
                                id: "noise-m1-c1-l1",
                                title: "Pondérations fréquentielles A et C",
                                type: "document",
                                duration: "12 min",
                                documentUrl: "ponderations_ac.pdf",
                                content: `
                                    <h2>Pondération Fréquentielle Acoustique</h2>
                                    <p>L'oreille humaine n'a pas la même sensibilité à toutes les fréquences du spectre audible.</p>
                                    <h3>Les filtres de pondération :</h3>
                                    <ul>
                                        <li><strong>Pondération A (dB(A)) :</strong> Conçue pour mimer l'oreille humaine à faible niveau de pression sonore. Utilisée pour évaluer l'exposition globale et le risque de surdité professionnelle.</li>
                                        <li><strong>Pondération C (dB(C)) :</strong> Utilisée pour les bruits d'impacts très brefs ou les sons à forte composante basse fréquence.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "noise-m1-c1-l2",
                                title: "Le sonomètre et la chaîne de mesure",
                                type: "document",
                                duration: "15 min",
                                documentUrl: "sonometre_guide.pdf",
                                content: `
                                    <h2>Le Sonomètre et son étalonnage</h2>
                                    <p>Un sonomètre de classe 1 (précision maximale) ou de classe 2 est composé d'un microphone, d'un préamplificateur, de filtres et d'un écran d'affichage.</p>
                                    <h3>Processus obligatoire d'étalonnage :</h3>
                                    <p>Un calibrateur acoustique émettant un signal stable à 94 dB ou 114 dB à 1 kHz doit être utilisé **avant et après** chaque série de mesures. Toute dérive supérieure à 0.5 dB annule la campagne de mesures.</p>
                                `
                            }
                        ]
                    },
                    {
                        id: "noise-m1-c2",
                        title: "Calculs acoustiques complexes",
                        lessons: [
                            {
                                id: "noise-m1-c2-l1",
                                title: "Calcul de sommation de sources de bruit",
                                type: "exercise",
                                duration: "12 min",
                                instructions: `
                                    <h2>Sommation logarithmique de sources de bruit</h2>
                                    <p>Les décibels étant logarithmiques, deux sources de 80 dB en fonctionnement simultané ne produisent pas 160 dB, mais 83 dB.</p>
                                    <p><strong>Votre objectif :</strong> Écrivez l'instruction définissant la fonction de sommation sous la forme L_TOTAL = 10 * log10(10^(L1/10) + 10^(L2/10)) pour valider le modèle.</p>
                                `,
                                starterCode: `// Écrivez l'instruction de sommation (ex: L_TOTAL = 10 * log10(sum))\n// Utilisez précisément la variable L_TOTAL dans votre formule :\n\n`,
                                solutionPattern: "L_TOTAL\\s*=\\s*10\\s*\\*\\s*log10",
                                hint: "Écrivez la formule d'affectation : L_TOTAL = 10 * log10"
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-noise-mod1",
                    title: "Validation : Métrologie Acoustique",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-noise-1",
                            text: "Quelle pondération fréquentielle est utilisée par défaut pour évaluer les risques de perte auditive en milieu de travail ?",
                            options: [
                                "Pondération A (dB(A))",
                                "Pondération C (dB(C))",
                                "Pondération Z (linéaire)",
                                "Pondération B (dB(B))"
                            ],
                            correctIndex: 0
                        },
                        {
                            id: "q-noise-2",
                            text: "Quelle est la dérive maximale autorisée sur le calibrateur avant/après mesures selon les normes ?",
                            options: [
                                "0.1 dB",
                                "0.5 dB",
                                "1.0 dB",
                                "2.0 dB"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            }
        ],
        exam: {
            title: "Examen de Certification - Acoustique et Vibrations",
            timeLimit: 1200,
            passingScore: 0.7,
            questions: [
                {
                    question: "Quelle pondération fréquentielle est utilisée par défaut pour évaluer les risques de perte auditive en milieu de travail ?",
                    options: [
                        "Pondération A (dB(A))",
                        "Pondération C (dB(C))",
                        "Pondération Z (linéaire)",
                        "Pondération B (dB(B))"
                    ],
                    correctIndex: 0
                },
                {
                    question: "Quelle est la dérive maximale autorisée sur le calibrateur avant/après mesures selon les normes ?",
                    options: [
                        "0.1 dB",
                        "0.5 dB",
                        "1.0 dB",
                        "2.0 dB"
                    ],
                    correctIndex: 1
                }
            ]
        }
    },
    {
        id: "course-safety",
        title: "Normes et standards santé sécurité au travail applicables en milieu de travail",
        description: "Formez-vous aux standards internationaux de prévention des risques d'incidents et d'accidents (norme ISO 45001), et à la structuration du Document Unique (DUER).",
        level: "advanced",
        levelText: "Avancé",
        duration: "12 heures",
        lessonsCount: 4,
        modules: [
            {
                id: "safety-mod1",
                title: "Cadre normatif et Évaluation des risques professionnels",
                description: "Comprenez l'architecture de la norme ISO 45001 et les étapes clés pour identifier et coter les risques SST.",
                chapters: [
                    {
                        id: "safety-m1-c1",
                        title: "Introduction à l'ISO 45001",
                        lessons: [
                            {
                                id: "safety-m1-c1-l1",
                                title: "Les fondamentaux de la norme ISO 45001",
                                type: "video",
                                duration: "10 min",
                                videoUrl: "https://www.youtube.com/embed/l8mBPCz2Tio",
                                content: "Ce cours présente les exigences de l'ISO 45001 relative aux Systèmes de Management de la Santé et de la Sécurité au Travail (SMSST)."
                            },
                            {
                                id: "safety-m1-c1-l2",
                                title: "Coter le Risque Professionnel",
                                type: "document",
                                duration: "15 min",
                                documentUrl: "cotation_risques.pdf",
                                content: `
                                    <h2>La méthodologie de cotation du risque</h2>
                                    <p>L'évaluation des risques professionnels repose sur la cotation de la probabilité d'occurrence et de la gravité.</p>
                                    <h3>Matrice de criticité de base :</h3>
                                    <ul>
                                        <li><strong>Probabilité (P) :</strong> Fréquence ou exposition de 1 (très rare) à 4 (très fréquente).</li>
                                        <li><strong>Gravité (G) :</strong> Conséquences de l'accident potentiel de 1 (bénin) à 4 (mortel ou incapacité permanente).</li>
                                    </ul>
                                `
                            }
                        ]
                    },
                    {
                        id: "safety-m1-c2",
                        title: "Exercices pratiques d'évaluation",
                        lessons: [
                            {
                                id: "safety-m1-c2-l1",
                                title: "Exercice : Formule mathématique de la criticité",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Calcul du Risque Résiduel</h2>
                                    <p>Le niveau de risque R se définit comme le produit direct de la Probabilité P par la Gravité G.</p>
                                    <p><strong>Votre objectif :</strong> Écrivez l'équation d'affectation : R = P * G</p>
                                `,
                                starterCode: `// Écrivez l'équation de calcul de la criticité (ex: R = ...)\n// Utilisez P pour Probabilité et G pour Gravité :\n\n`,
                                solutionPattern: "R\\s*=\\s*P\\s*\\*\\s*G",
                                hint: "La réponse attendue est R = P * G"
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-safety-mod1",
                    title: "Validation : Évaluation des Risques et ISO 45001",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-safety-1",
                            text: "Quel est l'objectif premier d'un SMSST certifié ISO 45001 ?",
                            options: [
                                "Augmenter le chiffre d'affaires",
                                "Fournir des lieux de travail sûrs et sains et prévenir les traumatismes et pathologies",
                                "Déclarer toutes les blessures à l'inspection",
                                "Automatiser les postes de travail physiques"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-safety-2",
                            text: "Comment calcule-t-on le niveau de risque de criticité en SST ?",
                            options: [
                                "Risque = Probabilité + Gravité",
                                "Risque = Probabilité * Gravité",
                                "Risque = Gravité / Probabilité",
                                "Risque = Coût financier / Temps"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            }
        ],
        exam: {
            title: "Examen de Certification - Normes SST & ISO 45001",
            timeLimit: 1200,
            passingScore: 0.7,
            questions: [
                {
                    question: "Quel est l'objectif premier d'un SMSST certifié ISO 45001 ?",
                    options: [
                        "Augmenter le chiffre d'affaires",
                        "Fournir des lieux de travail sûrs et sains et prévenir les traumatismes et pathologies",
                        "Déclarer toutes les blessures à l'inspection",
                        "Automatiser les postes de travail physiques"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Comment calcule-t-on le niveau de risque de criticité en SST ?",
                    options: [
                        "Risque = Probabilité + Gravité",
                        "Risque = Probabilité * Gravité",
                        "Risque = Gravité / Probabilité",
                        "Risque = Coût financier / Temps"
                    ],
                    correctIndex: 1
                }
            ]
        }
    },
    {
        id: "course-env",
        title: "Évaluation des impacts & risques environnementaux et PGES",
        description: "Maîtrisez les procédures d'évaluation environnementale stratégique (EES), les études d'impact sur l'environnement (EIE) et la rédaction de plans de gestion environnementale.",
        level: "advanced",
        levelText: "Avancé",
        duration: "15 heures",
        lessonsCount: 4,
        modules: [
            {
                id: "env-mod1",
                title: "Études d'Impact Environnemental et Social (EIES)",
                description: "Connaître les exigences réglementaires et de planification pour minimiser l'empreinte environnementale des projets industriels.",
                chapters: [
                    {
                        id: "env-m1-c1",
                        title: "Méthodologie générale d'une EIES",
                        lessons: [
                            {
                                id: "env-m1-c1-l1",
                                title: "Le processus complet de l'étude d'impact",
                                type: "video",
                                duration: "12 min",
                                videoUrl: "https://www.youtube.com/embed/l8mBPCz2Tio",
                                content: "Introduction au processus de l'EIES : état initial de l'environnement, identification des impacts directs, indirects et cumulatifs."
                            },
                            {
                                id: "env-m1-c1-l2",
                                title: "La doctrine Eviter-Reduire-Compenser (ERC)",
                                type: "document",
                                duration: "15 min",
                                documentUrl: "doctrine_erc.pdf",
                                content: `
                                    <h2>La doctrine réglementaire ERC</h2>
                                    <p>L'évaluation des impacts environnementaux exige d'appliquer une hiérarchie stricte d'intervention :</p>
                                    <ol>
                                        <li><strong>Éviter :</strong> Modifier le projet pour éviter tout impact (ex: changement de tracé routier).</li>
                                        <li><strong>Réduire :</strong> Mettre en œuvre des mesures pour atténuer l'intensité de l'impact inévitable.</li>
                                        <li><strong>Compenser :</strong> Apporter une contrepartie positive équivalente pour compenser la perte écologique résiduelle.</li>
                                    </ol>
                                `
                            }
                        ]
                    },
                    {
                        id: "env-m1-c2",
                        title: "Exercice d'application réglementaire",
                        lessons: [
                            {
                                id: "env-m1-c2-l1",
                                title: "Exercice : Déclaration de la doctrine ERC",
                                type: "exercise",
                                duration: "8 min",
                                instructions: `
                                    <h2>La Doctrine Réglementaire</h2>
                                    <p>Écrivez la valeur 'Eviter Reduire Compenser' pour initialiser la variable DOCTRINE afin de valider la conformité environnementale.</p>
                                `,
                                starterCode: `// Déclarez la doctrine réglementaire ERC en toutes lettres\n// DOCTRINE = "..."\n\n`,
                                solutionPattern: "DOCTRINE\\s*=\\s*\"eviter\\s+reduire\\s+compenser\"",
                                hint: "Écrivez : DOCTRINE = \"eviter reduire compenser\" en minuscules."
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-env-mod1",
                    title: "Validation : Processus d'EIES et PGES",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-env-1",
                            text: "Dans quel ordre hiérarchique doit-on appliquer la doctrine environnementale réglementaire ?",
                            options: [
                                "Compenser, Éviter, Réduire",
                                "Éviter, Réduire, Compenser",
                                "Réduire, Compenser, Éviter",
                                "Éviter, Compenser, Réduire"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-env-2",
                            text: "Que signifie le sigle PGES dans les rapports environnementaux ?",
                            options: [
                                "Plan de Gestion Environnementale et Sociale",
                                "Projet de Génie Environnemental et Spatial",
                                "Plan Global d'Évaluation de Sécurité",
                                "Protocole Général d'Entretien du Site"
                            ],
                            correctIndex: 0
                        }
                    ]
                }
            }
        ],
        exam: {
            title: "Examen de Certification - Impacts Environnementaux et PGES",
            timeLimit: 1200,
            passingScore: 0.7,
            questions: [
                {
                    question: "Dans quel ordre hiérarchique doit-on appliquer la doctrine environnementale réglementaire ?",
                    options: [
                        "Compenser, Éviter, Réduire",
                        "Éviter, Réduire, Compenser",
                        "Réduire, Compenser, Éviter",
                        "Éviter, Compenser, Réduire"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Que signifie le sigle PGES dans les rapports environnementaux ?",
                    options: [
                        "Plan de Gestion Environnementale et Sociale",
                        "Projet de Génie Environnemental et Spatial",
                        "Plan Global d'Évaluation de Sécurité",
                        "Protocole Général d'Entretien du Site"
                    ],
                    correctIndex: 0
                }
            ]
        }
    },
    {
        id: "course-safety-emergency",
        title: "Gestion de la santé, sécurité et situations d'urgence",
        description: "Permettre aux apprenants d’identifier les dangers, d’évaluer les risques professionnels, de mettre en œuvre des mesures de prévention et de participer efficacement à la préparation et à la gestion des situations d’urgence.",
        level: "advanced",
        levelText: "Professionnel",
        duration: "20 heures",
        lessonsCount: 8,
        modules: [
            {
                id: "hse-mod1",
                title: "Semaine 1 : Fondamentaux de la santé et sécurité au travail",
                description: "Introduction à la SST, typologie des dangers professionnels et cadre organisationnel de prévention.",
                chapters: [
                    {
                        id: "hse-m1-c1",
                        title: "Introduction et Typologie des dangers",
                        lessons: [
                            {
                                id: "hse-m1-c1-l1",
                                title: "Introduction à la SST et objectifs de la prévention",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Fondamentaux de la Santé et Sécurité au travail</h2>
                                    <p>La Santé et Sécurité au Travail (SST) vise à prévenir les accidents du travail et les maladies professionnelles en agissant sur les conditions de travail.</p>
                                    <h3>Notions clés :</h3>
                                    <ul>
                                        <li><strong>Danger :</strong> Source potentielle de dommage (ex: un produit chimique corrosif).</li>
                                        <li><strong>Risque :</strong> Probabilité que le danger cause un dommage (ex: risque d'inhalation ou de brûlure lors de la manipulation).</li>
                                        <li><strong>Incident :</strong> Événement inattendu n'ayant pas entraîné de blessure (presque-accident).</li>
                                        <li><strong>Accident :</strong> Événement soudain entraînant une blessure physique ou psychologique.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "hse-m1-c1-l2",
                                title: "Typologie des dangers professionnels",
                                type: "document",
                                duration: "20 min",
                                content: `
                                    <h2>Classification des dangers professionnels</h2>
                                    <p>Pour mieux les identifier et les traiter, les dangers sont classés en plusieurs familles :</p>
                                    <ul>
                                        <li><strong>Physiques :</strong> Bruit, vibrations, rayonnements, températures extrêmes.</li>
                                        <li><strong>Chimiques :</strong> Solvants, poussières, vapeurs toxiques, amiante.</li>
                                        <li><strong>Biologiques :</strong> Virus, bactéries, moisissures.</li>
                                        <li><strong>Mécaniques :</strong> Pièces en mouvement, chutes d'objets, écrasements.</li>
                                        <li><strong>Ergonomiques :</strong> Postures pénibles, gestes répétitifs, manutention manuelle de charges lourdes.</li>
                                        <li><strong>Psychosociaux (RPS) :</strong> Stress, harcèlement, surcharge de travail.</li>
                                    </ul>
                                `
                            }
                        ]
                    },
                    {
                        id: "hse-m1-c2",
                        title: "Cadre de prévention & Exercices",
                        lessons: [
                            {
                                id: "hse-m1-c2-l1",
                                title: "Cadre organisationnel de la prévention",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Le système de management de la SST</h2>
                                    <p>La prévention efficace repose sur un cadre structuré et des responsabilités claires :</p>
                                    <h3>Le Comité SST (CSST) :</h3>
                                    <p>Instance paritaire regroupant des représentants des travailleurs et de la direction pour analyser les conditions de travail, enquêter sur les accidents et promouvoir les bonnes pratiques de sécurité.</p>
                                    <h3>La culture de sécurité :</h3>
                                    <p>C'est l'ensemble des manières de penser et d'agir partagées par les membres d'une organisation en matière de sécurité, allant de la conformité passive à la prévention proactive.</p>
                                `
                            },
                            {
                                id: "hse-m1-c2-l2",
                                title: "Exercice : Déclaration de danger",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Exercice d'identification de danger</h2>
                                    <p>Pour valider la compréhension des concepts, initialisez la variable DANGER avec la valeur "hauteur" pour modéliser le risque de chute d'un échafaudage.</p>
                                `,
                                starterCode: `// Définissez le danger identifié sous forme de chaîne de caractères\n// DANGER = "..."\n\n`,
                                solutionPattern: "DANGER\\s*=\\s*\"hauteur\"",
                                hint: "Écrivez : DANGER = \"hauteur\""
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-hse-mod1",
                    title: "Validation : Fondamentaux de la SST",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-hse-1-1",
                            text: "Quelle épreuve définit la source potentielle de dommage en SST ?",
                            options: [
                                "La probabilité de survenue d'un accident",
                                "Une source potentielle de dommage (Danger)",
                                "Le coût financier lié à un arrêt de travail",
                                "Un équipement de protection individuelle"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-hse-1-2",
                            text: "Le bruit et les vibrations appartiennent à quelle catégorie de dangers ?",
                            options: [
                                "Dangers chimiques",
                                "Dangers physiques",
                                "Risques psychosociaux",
                                "Dangers biologiques"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            },
            {
                id: "hse-mod2",
                title: "Semaine 2 : Évaluation et maîtrise des risques professionnels",
                description: "Identification et évaluation des risques professionnels, matrice de criticité et hiérarchie des mesures de prévention.",
                chapters: [
                    {
                        id: "hse-m2-c1",
                        title: "Évaluation et Matrice de criticité",
                        lessons: [
                            {
                                id: "hse-m2-c1-l1",
                                title: "Identification des risques professionnels",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Évaluation des risques professionnels (EvRP)</h2>
                                    <p>L'évaluation des risques est une obligation légale de l'employeur. Elle comprend l'observation des postes, l'analyse des tâches et la consultation des travailleurs.</p>
                                    <h3>Calcul de la criticité :</h3>
                                    <p>La criticité (C) du risque est évaluée selon la formule : <code>Criticité (C) = Probabilité (P) × Gravité (G)</code>.</p>
                                    <ul>
                                        <li><strong>Probabilité (P) :</strong> Fréquence d'exposition (1 à 4).</li>
                                        <li><strong>Gravité (G) :</strong> Sévérité des dommages potentiels (1 à 4).</li>
                                    </ul>
                                `
                            },
                            {
                                id: "hse-m2-c1-l2",
                                title: "La hiérarchie des mesures de prévention",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Les principes généraux de prévention (PGP)</h2>
                                    <p>Pour éliminer ou réduire les risques, les mesures doivent être appliquées selon un ordre hiérarchique strict :</p>
                                    <ol>
                                        <li><strong>Élimination :</strong> Supprimer totalement le danger (ex: ne plus faire de travaux en hauteur).</li>
                                        <li><strong>Substitution :</strong> Remplacer le produit/procédé par un moins dangereux.</li>
                                        <li><strong>Mesures techniques :</strong> Protections collectives (ex: garde-corps, systèmes d'aspiration).</li>
                                        <li><strong>Mesures organisationnelles :</strong> Signalisation, formation, rotation des tâches.</li>
                                        <li><strong>Équipements de Protection Individuelle (EPI) :</strong> Casques, lunettes, harnais (en dernier recours).</li>
                                    </ol>
                                `
                            }
                        ]
                    },
                    {
                        id: "hse-m2-c2",
                        title: "Procédures et Permis de travail",
                        lessons: [
                            {
                                id: "hse-m2-c2-l1",
                                title: "Permis de travail et consignations",
                                type: "document",
                                duration: "20 min",
                                content: `
                                    <h2>Gestion des travaux à hauts risques</h2>
                                    <p>Certains travaux nécessitent une autorisation écrite formelle appelée <strong>Permis de travail</strong> :</p>
                                    <ul>
                                        <li><strong>Permis de feu :</strong> Pour les travaux par point chaud (soudage, meulage).</li>
                                        <li><strong>Permis de pénétration en espace confiné :</strong> Risque d'anoxie ou d'atmosphère toxique.</li>
                                        <li><strong>Consignation LOTO (Lockout/Tagout) :</strong> Procédure de mise hors tension physique des énergies (électrique, hydraulique, mécanique) avant toute maintenance.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "hse-m2-c2-l2",
                                title: "Exercice : Calcul de criticité de risque",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Calculateur de criticité SST</h2>
                                    <p>Calculez le niveau de risque résiduel en multipliant la variable P (Probabilité) par la variable G (Gravité) et affectez le résultat à la variable CRITICITE.</p>
                                `,
                                starterCode: `// Écrivez l'équation de calcul de la criticité\n// CRITICITE = ...\n\n`,
                                solutionPattern: "CRITICITE\\s*=\\s*P\\s*\\*\\s*G",
                                hint: "Écrivez : CRITICITE = P * G"
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-hse-mod2",
                    title: "Validation : Évaluation des Risques",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-hse-2-1",
                            text: "Quel est l'ordre de priorité correct des mesures de contrôle ?",
                            options: [
                                "EPI, Mesures techniques, Élimination, Substitution",
                                "Élimination, Substitution, Mesures techniques, EPI",
                                "Substitution, Élimination, EPI, Mesures techniques",
                                "Mesures techniques, EPI, Substitution, Élimination"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-hse-2-2",
                            text: "Que signifie le sigle LOTO en SST ?",
                            options: [
                                "La loterie nationale de sécurité",
                                "Lockout / Tagout (Consignation et étiquetage)",
                                "Logistique et Organisation du Travail Opérationnel",
                                "Lavage Obligatoire des Tenues Opérationnelles"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            },
            {
                id: "hse-mod3",
                title: "Semaine 3 : Accidents, incidents et performance SST",
                description: "Gestion des accidents de travail, méthode d'analyse des causes profondes et suivi des indicateurs de performance.",
                chapters: [
                    {
                        id: "hse-m3-c1",
                        title: "Gestion des accidents et Analyses de causes",
                        lessons: [
                            {
                                id: "hse-m3-c1-l1",
                                title: "Réaction immédiate et enquête d'accident",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Procédure en cas d'accident du travail</h2>
                                    <p>En cas d'accident, la première action est de **secourir la victime et de sécuriser la zone** pour éviter un suraccident.</p>
                                    <h3>Étapes de l'enquête :</h3>
                                    <ol>
                                        <li>Recueillir les faits bruts sans jugement.</li>
                                        <li>Interroger les témoins le plus tôt possible.</li>
                                        <li>Rechercher les causes en utilisant l'arbre des causes ou la méthode des 5 Pourquoi.</li>
                                    </ol>
                                `
                            },
                            {
                                id: "hse-m3-c1-l2",
                                title: "La méthode des 5 Pourquoi et l'arbre des causes",
                                type: "document",
                                duration: "20 min",
                                content: `
                                    <h2>Analyse des causes profondes (RCA)</h2>
                                    <p>Pour éviter qu'un accident ne se reproduise, on doit traiter ses causes organisationnelles ou techniques profondes, et non les symptômes immédiats.</p>
                                    <h3>Les 5 Pourquoi :</h3>
                                    <p>Poser successivement la question "Pourquoi ?" au moins 5 fois à partir du fait initial pour remonter à l'origine organisationnelle.</p>
                                    <h3>L'Arbre des Causes :</h3>
                                    <p>Représentation graphique logique reliant le fait ultime (l'accident) aux faits antécédents en posant pour chaque fait les questions : "Qu'a-t-il fallu pour que ce fait se produise ?" et "Est-ce nécessaire et suffisant ?".</p>
                                `
                            }
                        ]
                    },
                    {
                        id: "hse-m3-c2",
                        title: "Indicateurs de Performance SST",
                        lessons: [
                            {
                                id: "hse-m3-c2-l1",
                                title: "Taux de Fréquence (TF) et Taux de Gravité (TG)",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Indicateurs de performance SST réglementaires</h2>
                                    <p>Pour mesurer l'efficacité de la prévention, deux indicateurs internationaux clés sont calculés :</p>
                                    <ul>
                                        <li><strong>Taux de Fréquence (TF) :</strong> Nombre d'accidents avec arrêt par million d'heures travaillées. <br><code>TF = (Accidents × 1 000 000) / Heures travaillées</code>.</li>
                                        <li><strong>Taux de Gravité (TG) :</strong> Nombre de journées perdues par incapacité temporaire pour mille heures travaillées. <br><code>TG = (Journées perdues × 1 000) / Heures travaillées</code>.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "hse-m3-c2-l2",
                                title: "Exercice : Calcul du Taux de Fréquence",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Calcul du Taux de Fréquence (TF)</h2>
                                    <p>Calculez le taux de fréquence en appliquant la formule standard et affectez-le à la variable TF. Formule : TF = (ACCIDENTS * 1000000) / HEURES</p>
                                `,
                                starterCode: `// Écrivez la formule de calcul du Taux de Fréquence\n// TF = ...\n\n`,
                                solutionPattern: "TF\\s*=\\s*\\(\\s*ACCIDENTS\\s*\\*\\s*1000000\\s*\\)\\s*/\\s*HEURES",
                                hint: "Écrivez : TF = (ACCIDENTS * 1000000) / HEURES"
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-hse-mod3",
                    title: "Validation : Accidents et Indicateurs SST",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-hse-3-1",
                            text: "Quelle est la première action à mener immédiatement après la survenue d'un accident du travail ?",
                            options: [
                                "Rédiger le rapport d'accident",
                                "Secourir la victime et sécuriser le lieu pour éviter un suraccident",
                                "Appeler l'inspecteur du travail",
                                "Trouver le responsable de l'erreur"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-hse-3-2",
                            text: "Comment se définit le Taux de Fréquence (TF) ?",
                            options: [
                                "Le nombre d'accidents avec arrêt par million d'heures travaillées",
                                "Le nombre de journées perdues par millier d'heures travaillées",
                                "Le pourcentage de salariés formés aux premiers secours",
                                "La fréquence des réunions du comité SST"
                            ],
                            correctIndex: 0
                        }
                    ]
                }
            },
            {
                id: "hse-mod4",
                title: "Semaine 4 : Préparation et gestion des situations d’urgence",
                description: "Élaboration d'un plan d'urgence, rôles en cas d'évacuation, alerte et exercices de simulation.",
                chapters: [
                    {
                        id: "hse-m4-c1",
                        title: "Plan d'Urgence et Organisation",
                        lessons: [
                            {
                                id: "hse-m4-c1-l1",
                                title: "Élaboration d'un Plan d'Opération Interne (POI)",
                                type: "document",
                                duration: "20 min",
                                content: `
                                    <h2>Le Plan d'Urgence / Plan d'Opération Interne (POI)</h2>
                                    <p>Le plan d'urgence organise les secours, définit la chaîne d'alerte, liste les équipements nécessaires et structure la réponse face à des scénarios prédéfinis (incendie, explosion, catastrophe naturelle, accident de masse).</p>
                                    <h3>Éléments constitutifs :</h3>
                                    <ul>
                                        <li>Organigramme de crise.</li>
                                        <li>Chaîne d'alerte claire (qui alerte qui, numéros d'urgence internes et externes).</li>
                                        <li>Moyens matériels de secours (extincteurs, RIA, trousses de secours, alarmes).</li>
                                        <li>Plan d'évacuation avec points de rassemblement sécurisés.</li>
                                    </ul>
                                `
                            },
                            {
                                id: "hse-m4-c1-l2",
                                title: "Organisation de l'évacuation",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>Rôles clés lors d'une évacuation</h2>
                                    <p>L'évacuation ne doit pas s'improviser. Elle nécessite de désigner et former du personnel à des rôles clés :</p>
                                    <ul>
                                        <li><strong>Guide-file :</strong> Personne désignée pour guider les occupants de son secteur vers la sortie d'urgence et le point de rassemblement.</li>
                                        <li><strong>Serre-file :</strong> Personne désignée pour passer derrière les occupants, inspecter les locaux (toilettes, bureaux fermés) afin de s'assurer que personne ne reste à l'intérieur, et fermer les portes derrière elle.</li>
                                        <li><strong>Point de rassemblement :</strong> Zone sécurisée à l'extérieur des bâtiments où l'on effectue l'appel pour s'assurer que tout le monde est sorti sain et sauf.</li>
                                    </ul>
                                `
                            }
                        ]
                    },
                    {
                        id: "hse-m4-c2",
                        title: "Exercices d'évacuation & Alerte",
                        lessons: [
                            {
                                id: "hse-m4-c2-l1",
                                title: "Exercices de simulation et RETEX",
                                type: "document",
                                duration: "15 min",
                                content: `
                                    <h2>L'importance de l'entraînement régulier</h2>
                                    <p>Les exercices d'évacuation doivent être répétés au moins deux fois par an pour entraîner le personnel et tester l'efficacité du système.</p>
                                    <h3>Retour d'expérience (RETEX) :</h3>
                                    <p>Après chaque exercice ou situation réelle, une réunion d'évaluation permet de relever les dysfonctionnements (portes bloquées, alarme inaudible, temps d'évacuation trop long) et de définir des actions correctives d'amélioration continue.</p>
                                `
                            },
                            {
                                id: "hse-m4-c2-l2",
                                title: "Exercice : Procédure d'évacuation",
                                type: "exercise",
                                duration: "10 min",
                                instructions: `
                                    <h2>Déclenchement de l'alarme d'urgence</h2>
                                    <p>Pour simuler l'alerte d'évacuation générale, écrivez le code permettant d'affecter la valeur "active" à la variable ALARME.</p>
                                `,
                                starterCode: `// Déclenchez l'alarme en lui affectant la valeur "active"\n// ALARME = "..."\n\n`,
                                solutionPattern: "ALARME\\s*=\\s*\"active\"",
                                hint: "Écrivez : ALARME = \"active\""
                            }
                        ]
                    }
                ],
                quiz: {
                    quizId: "quiz-hse-mod4",
                    title: "Validation : Planification et Urgence",
                    passingScore: 0.7,
                    questions: [
                        {
                            id: "q-hse-4-1",
                            text: "Quel est le rôle spécifique du serre-file lors d'une évacuation ?",
                            options: [
                                "Guider le groupe vers le point de rassemblement",
                                "Inspecter les pièces pour s'assurer que tout le monde a évacué et fermer les portes",
                                "Appeler les pompiers au téléphone",
                                "Combattre l'incendie à l'aide d'extincteurs"
                            ],
                            correctIndex: 1
                        },
                        {
                            id: "q-hse-4-2",
                            text: "À quelle fréquence minimale recommandée doit-on organiser des exercices d'évacuation ?",
                            options: [
                                "Une fois tous les 5 ans",
                                "Au moins deux fois par an",
                                "Uniquement après un accident réel",
                                "Tous les mois"
                            ],
                            correctIndex: 1
                        }
                    ]
                }
            }
        ],
        exam: {
            title: "Examen Final de Certification - Gestion SST et Urgences",
            timeLimit: 4500,
            passingScore: 0.7,
            questions: [
                {
                    question: "Quelle différence fondamentale sépare un danger d'un risque ?",
                    options: [
                        "Il n'y a aucune différence pratique",
                        "Le danger est la source intrinsèque de dommage, le risque est la probabilité de survenue associée à la gravité",
                        "Le danger est collectif alors que le risque est strictement individuel",
                        "Le risque est toujours d'origine chimique alors que le danger est mécanique"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Dans la hiérarchie des mesures de prévention, laquelle doit être privilégiée en premier lieu ?",
                    options: [
                        "Fournir des Équipements de Protection Individuelle (EPI)",
                        "Éliminer le danger à la source",
                        "Installer des protections collectives",
                        "Former les équipes"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Que représente le Taux de Fréquence (TF) ?",
                    options: [
                        "Le nombre de réunions du CSST sur l'année",
                        "Le nombre d'accidents de travail avec arrêt par million d'heures travaillées",
                        "Le nombre d'heures de formation dispensées",
                        "Le coût des primes d'assurances de sécurité"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Quel outil graphique logique permet de remonter des faits constants jusqu'à l'origine d'un accident ?",
                    options: [
                        "La matrice SWOT",
                        "L'arbre des causes",
                        "Le diagramme de Gantt",
                        "La courbe de criticité résiduelle"
                    ],
                    correctIndex: 1
                },
                {
                    question: "Qui est chargé de mener l'évacuation en fermant la marche et en vérifiant que personne ne reste dans les locaux ?",
                    options: [
                        "Le guide-file",
                        "Le serre-file",
                        "Le chef d'établissement",
                        "Le secouriste du travail"
                    ],
                    correctIndex: 1
                }
            ]
        }
    }
];

window.COURSES = COURSES;
