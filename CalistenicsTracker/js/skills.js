// Initial skill tree setup
const SkillsInit = {
    // Version number - increment this when skill requirements change
    SKILL_TREE_VERSION: 2,
    
    initialize: function() {
        const skills = Storage.getSkills();
        const settings = Storage.getSettings();
        const currentVersion = settings.skillTreeVersion || 0;
        
        // Check if skills need to be reloaded (version mismatch or missing key skill)
        const hasInitializedTree = skills.some(skill => skill.id === 'dead_hang');
        const needsUpdate = skills.length === 0 || 
                           !hasInitializedTree || 
                           currentVersion !== this.SKILL_TREE_VERSION;
        
        // If skills need updating, create the full tree
        if (needsUpdate) {
            // Clear old skills if they exist
            if (skills.length > 0) {
                skills.forEach(skill => {
                    Storage.deleteSkill(skill.id);
                });
            }
            const skillTree = [
                {
                    id: 'dead_hang',
                    name: 'Dead Hang',
                    description: 'Hold onto a bar with both hands for the target duration',
                    requirements: [
                        { exerciseId: 'dead_hang', targetValue: 20, type: 'time', description: '20 second dead hang' }
                    ],
                    dependencies: []
                },
                {
                    id: 'band_pullup',
                    name: 'Band-Assisted Pull-Up',
                    description: 'Perform pull-ups with resistance band assistance',
                    requirements: [
                        { exerciseId: 'band_pullup', targetValue: 30, type: 'reps', description: '6×5 band-assisted pull-ups (30 total reps)' }
                    ],
                    dependencies: ['dead_hang']
                },
                {
                    id: 'pullup',
                    name: 'Pull-Up',
                    description: 'Perform unassisted pull-ups with proper form',
                    requirements: [
                        { exerciseId: 'band_pullup', targetValue: 30, type: 'reps', description: '6×5 band-assisted pull-ups (30 total reps)' },
                        { exerciseId: 'dead_hang', targetValue: 30, type: 'time', description: '30 second dead hang for grip strength' }
                    ],
                    dependencies: ['band_pullup']
                },
                {
                    id: 'pullup_5',
                    name: '5 Pull-Ups',
                    description: 'Perform 5 consecutive pull-ups',
                    requirements: [
                        { exerciseId: 'pullup', targetValue: 5, type: 'reps', description: '5 pull-ups' }
                    ],
                    dependencies: ['pullup']
                },
                {
                    id: 'explosive_pullup',
                    name: 'Explosive Pull-Up',
                    description: 'Perform explosive pull-ups with maximum power',
                    requirements: [
                        { exerciseId: 'pullup', targetValue: 5, type: 'reps', description: '5 regular pull-ups for base strength' },
                        { exerciseId: 'band_pullup', targetValue: 20, type: 'reps', description: '4×5 band-assisted pull-ups for explosive training' }
                    ],
                    dependencies: ['pullup_5']
                },
                {
                    id: 'one_arm_pullup',
                    name: 'One-Arm Pull-Up',
                    description: 'Perform a pull-up using only one arm',
                    requirements: [
                        { exerciseId: 'archer_pullup', targetValue: 3, type: 'reps', description: '3 archer pull-ups' },
                        { exerciseId: 'assisted_one_arm_pullup', targetValue: 1, type: 'reps', description: '1 assisted one-arm pull-up' }
                    ],
                    dependencies: ['pullup_5']
                },
                {
                    id: 'l_sit',
                    name: 'L-Sit',
                    description: 'Hold the L-sit position',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 15, type: 'reps', description: '15 push-ups for core and pressing strength' }
                    ],
                    dependencies: []
                },
                {
                    id: 'tuck_front_lever',
                    name: 'Tuck Front Lever',
                    description: 'Hold the tuck front lever position',
                    requirements: [
                        { exerciseId: 'dead_hang', targetValue: 30, type: 'time', description: '30 second dead hang for grip and lat strength' },
                        { exerciseId: 'pullup', targetValue: 3, type: 'reps', description: '3 pull-ups for lat strength' }
                    ],
                    dependencies: ['dead_hang']
                },
                {
                    id: 'advanced_tuck_front_lever',
                    name: 'Advanced Tuck Front Lever',
                    description: 'Hold the advanced tuck front lever position',
                    requirements: [
                        { exerciseId: 'tuck_front_lever_hold', targetValue: 15, type: 'time', description: '15 second tuck front lever hold' },
                        { exerciseId: 'pullup', targetValue: 5, type: 'reps', description: '5 pull-ups for lat strength' }
                    ],
                    dependencies: ['tuck_front_lever']
                },
                {
                    id: 'front_lever',
                    name: 'Front Lever',
                    description: 'Hold the full front lever position',
                    requirements: [
                        { exerciseId: 'advanced_tuck_front_lever_hold', targetValue: 15, type: 'time', description: '15 second advanced tuck front lever hold' },
                        { exerciseId: 'pullup', targetValue: 8, type: 'reps', description: '8 pull-ups for lat strength' }
                    ],
                    dependencies: ['advanced_tuck_front_lever']
                },
                {
                    id: 'back_lever',
                    name: 'Back Lever',
                    description: 'Hold the back lever position',
                    requirements: [
                        { exerciseId: 'dead_hang', targetValue: 30, type: 'time', description: '30 second dead hang for grip strength' },
                        { exerciseId: 'pullup', targetValue: 5, type: 'reps', description: '5 pull-ups for upper body strength' }
                    ],
                    dependencies: ['dead_hang']
                },
                {
                    id: 'pushup',
                    name: 'Push-Up',
                    description: 'Perform push-ups with proper form',
                    requirements: [
                        { exerciseId: 'knee_pushup', targetValue: 20, type: 'reps', description: '20 knee push-ups for building base strength' }
                    ],
                    dependencies: []
                },
                {
                    id: 'pushup_20',
                    name: '20 Push-Ups',
                    description: 'Perform 20 consecutive push-ups',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 20, type: 'reps', description: '20 push-ups' }
                    ],
                    dependencies: ['pushup']
                },
                {
                    id: 'diamond_pushup',
                    name: 'Diamond Push-Up',
                    description: 'Perform diamond push-ups with hands in diamond shape',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 15, type: 'reps', description: '15 regular push-ups for base strength' }
                    ],
                    dependencies: ['pushup']
                },
                {
                    id: 'pseudo_planche_pushup',
                    name: 'Pseudo Planche Push-Up',
                    description: 'Perform push-ups with hands positioned far forward',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 20, type: 'reps', description: '20 regular push-ups for base strength' },
                        { exerciseId: 'diamond_pushup', targetValue: 10, type: 'reps', description: '10 diamond push-ups for triceps strength' }
                    ],
                    dependencies: ['pushup']
                },
                {
                    id: 'planche_tuck',
                    name: 'Tuck Planche',
                    description: 'Hold the tuck planche position',
                    requirements: [
                        { exerciseId: 'pseudo_planche_pushup', targetValue: 10, type: 'reps', description: '10 pseudo planche push-ups for shoulder strength' },
                        { exerciseId: 'pushup', targetValue: 25, type: 'reps', description: '25 push-ups for general pressing strength' }
                    ],
                    dependencies: ['pseudo_planche_pushup']
                },
                {
                    id: 'planche',
                    name: 'Planche',
                    description: 'Hold the full planche position',
                    requirements: [
                        { exerciseId: 'tuck_planche_hold', targetValue: 15, type: 'time', description: '15 second tuck planche hold' },
                        { exerciseId: 'pseudo_planche_pushup', targetValue: 15, type: 'reps', description: '15 pseudo planche push-ups' }
                    ],
                    dependencies: ['planche_tuck']
                },
                {
                    id: 'dip',
                    name: 'Dip',
                    description: 'Perform dips on parallel bars',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 20, type: 'reps', description: '20 push-ups for upper body strength' },
                        { exerciseId: 'chair_dip', targetValue: 15, type: 'reps', description: '15 chair dips (assisted) for triceps conditioning' }
                    ],
                    dependencies: ['pushup']
                },
                {
                    id: 'ring_dip',
                    name: 'Ring Dip',
                    description: 'Perform dips on gymnastics rings',
                    requirements: [
                        { exerciseId: 'dip', targetValue: 10, type: 'reps', description: '10 regular dips for base strength' }
                    ],
                    dependencies: ['dip']
                },
                {
                    id: 'muscle_up',
                    name: 'Muscle-Up',
                    description: 'Perform a muscle-up (pull-up transition to dip)',
                    requirements: [
                        { exerciseId: 'pullup', targetValue: 5, type: 'reps', description: '5 pull-ups' },
                        { exerciseId: 'dip', targetValue: 10, type: 'reps', description: '10 dips' },
                        { exerciseId: 'explosive_pullup', targetValue: 3, type: 'reps', description: '3 explosive pull-ups' }
                    ],
                    dependencies: ['pullup_5', 'ring_dip']
                },
                {
                    id: 'handstand',
                    name: 'Handstand',
                    description: 'Hold a handstand against the wall',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 10, type: 'reps', description: '10 push-ups for shoulder stability' }
                    ],
                    dependencies: []
                },
                {
                    id: 'handstand_30',
                    name: 'Freestanding Handstand',
                    description: 'Hold a freestanding handstand',
                    requirements: [
                        { exerciseId: 'wall_handstand_hold', targetValue: 30, type: 'time', description: '30 second wall handstand hold for balance and strength' }
                    ],
                    dependencies: ['handstand']
                },
                {
                    id: 'handstand_pushup',
                    name: 'Handstand Push-Up',
                    description: 'Perform a handstand push-up',
                    requirements: [
                        { exerciseId: 'freestanding_handstand_hold', targetValue: 15, type: 'time', description: '15 second freestanding handstand for balance' },
                        { exerciseId: 'pushup', targetValue: 20, type: 'reps', description: '20 push-ups for pressing strength' },
                        { exerciseId: 'pseudo_planche_pushup', targetValue: 5, type: 'reps', description: '5 pseudo planche push-ups for shoulder strength' }
                    ],
                    dependencies: ['handstand_30']
                },
                {
                    id: 'pistol_squat',
                    name: 'Pistol Squat',
                    description: 'Perform a single-leg squat (pistol squat)',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 10, type: 'reps', description: '10 push-ups (general strength base)' }
                    ],
                    dependencies: []
                },
                {
                    id: 'shrimp_squat',
                    name: 'Shrimp Squat',
                    description: 'Perform a shrimp squat (one-legged squat with leg held behind)',
                    requirements: [
                        { exerciseId: 'pushup', targetValue: 10, type: 'reps', description: '10 push-ups (general strength base)' }
                    ],
                    dependencies: []
                }
            ];

            // Save all skills
            skillTree.forEach(skill => {
                Storage.saveSkill(skill);
            });
            
            // Save the version
            settings.skillTreeVersion = this.SKILL_TREE_VERSION;
            Storage.saveSettings(settings);
        }
    },
    
    // Force reload skills (can be called from console: SkillsInit.forceReload())
    forceReload: function() {
        const skills = Storage.getSkills();
        skills.forEach(skill => {
            Storage.deleteSkill(skill.id);
        });
        const settings = Storage.getSettings();
        settings.skillTreeVersion = 0;
        Storage.saveSettings(settings);
        this.initialize();
        console.log('Skills reloaded! Refresh the page to see changes.');
    }
};

// Initialize skills on load
SkillsInit.initialize();

