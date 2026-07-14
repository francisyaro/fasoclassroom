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
        ]
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
        ]
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
        ]
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
        ]
    }
];

window.COURSES = COURSES;
