// localStorage wrapper functions
const Storage = {
    // Logs storage
    getLogs: function() {
        const logs = localStorage.getItem('logs');
        return logs ? JSON.parse(logs) : [];
    },

    saveLog: function(log) {
        const logs = this.getLogs();
        log.id = Date.now().toString();
        logs.push(log);
        localStorage.setItem('logs', JSON.stringify(logs));
        return log;
    },

    deleteLog: function(logId) {
        const logs = this.getLogs();
        const filtered = logs.filter(log => log.id !== logId);
        localStorage.setItem('logs', JSON.stringify(filtered));
    },

    // Exercises storage
    getExercises: function() {
        const exercises = localStorage.getItem('exercises');
        if (exercises) {
            return JSON.parse(exercises);
        }
        // Return default exercises if none exist
        return this.getDefaultExercises();
    },

    getDefaultExercises: function() {
        return [
            // Pull-up progression
            { id: 'dead_hang', name: 'Dead Hang', type: 'time' },
            { id: 'band_pullup', name: 'Band-assisted Pull-up', type: 'weight' },
            { id: 'pullup', name: 'Pull-up', type: 'reps' },
            { id: 'explosive_pullup', name: 'Explosive Pull-up', type: 'reps' },
            { id: 'archer_pullup', name: 'Archer Pull-up', type: 'reps' },
            { id: 'assisted_one_arm_pullup', name: 'Assisted One-Arm Pull-up', type: 'reps' },
            { id: 'chinup', name: 'Chin-up', type: 'reps' },
            { id: 'band_chinup', name: 'Band-assisted Chin-up', type: 'weight' },
            { id: 'hang', name: 'Hang', type: 'time' },
            
            // Lever progression
            { id: 'tuck_front_lever_hold', name: 'Tuck Front Lever Hold', type: 'time' },
            { id: 'advanced_tuck_front_lever_hold', name: 'Advanced Tuck Front Lever Hold', type: 'time' },
            { id: 'front_lever_hold', name: 'Front Lever Hold', type: 'time' },
            { id: 'back_lever_hold', name: 'Back Lever Hold', type: 'time' },
            
            // Push-up progression
            { id: 'knee_pushup', name: 'Knee Push-up', type: 'reps' },
            { id: 'pushup', name: 'Push-up', type: 'reps' },
            { id: 'diamond_pushup', name: 'Diamond Push-up', type: 'reps' },
            { id: 'pseudo_planche_pushup', name: 'Pseudo Planche Push-up', type: 'reps' },
            
            // Planche progression
            { id: 'tuck_planche_hold', name: 'Tuck Planche Hold', type: 'time' },
            { id: 'planche_hold', name: 'Planche Hold', type: 'time' },
            
            // Dip progression
            { id: 'chair_dip', name: 'Chair Dip (Assisted)', type: 'reps' },
            { id: 'band_dip', name: 'Band-assisted Dip', type: 'weight' },
            { id: 'dip', name: 'Dip', type: 'reps' },
            { id: 'ring_dip', name: 'Ring Dip', type: 'reps' },
            
            // Muscle-up
            { id: 'muscle_up', name: 'Muscle-up', type: 'reps' },
            
            // Handstand progression
            { id: 'handstand', name: 'Handstand', type: 'time' },
            { id: 'wall_handstand_hold', name: 'Wall Handstand Hold', type: 'time' },
            { id: 'freestanding_handstand_hold', name: 'Freestanding Handstand Hold', type: 'time' },
            { id: 'handstand_pushup', name: 'Handstand Push-up', type: 'reps' },
            
            // L-sit
            { id: 'lsit', name: 'L-sit', type: 'time' },
            { id: 'l_sit_hold', name: 'L-Sit Hold', type: 'time' },
            
            // Legs
            { id: 'pistol_squat', name: 'Pistol Squat', type: 'reps' },
            { id: 'shrimp_squat', name: 'Shrimp Squat', type: 'reps' }
        ];
    },

    saveExercise: function(exercise) {
        const exercises = this.getExercises();
        if (exercise.id && exercises.find(e => e.id === exercise.id)) {
            // Update existing
            const index = exercises.findIndex(e => e.id === exercise.id);
            exercises[index] = exercise;
        } else {
            // Add new
            if (!exercise.id) {
                exercise.id = exercise.name.toLowerCase().replace(/\s+/g, '_');
            }
            exercises.push(exercise);
        }
        localStorage.setItem('exercises', JSON.stringify(exercises));
        return exercise;
    },

    deleteExercise: function(exerciseId) {
        const exercises = this.getExercises();
        const filtered = exercises.filter(e => e.id !== exerciseId);
        localStorage.setItem('exercises', JSON.stringify(filtered));
    },

    getExercise: function(exerciseId) {
        const exercises = this.getExercises();
        return exercises.find(e => e.id === exerciseId);
    },

    // Skills storage
    getSkills: function() {
        const skills = localStorage.getItem('skills');
        return skills ? JSON.parse(skills) : [];
    },

    saveSkill: function(skill) {
        const skills = this.getSkills();
        if (skill.id && skills.find(s => s.id === skill.id)) {
            // Update existing
            const index = skills.findIndex(s => s.id === skill.id);
            skills[index] = skill;
        } else {
            // Add new
            if (!skill.id) {
                skill.id = skill.name.toLowerCase().replace(/\s+/g, '_');
            }
            skills.push(skill);
        }
        localStorage.setItem('skills', JSON.stringify(skills));
        return skill;
    },

    deleteSkill: function(skillId) {
        const skills = this.getSkills();
        const filtered = skills.filter(s => s.id !== skillId);
        localStorage.setItem('skills', JSON.stringify(filtered));
    },

    getSkill: function(skillId) {
        const skills = this.getSkills();
        return skills.find(s => s.id === skillId);
    },

    // Settings storage
    getSettings: function() {
        const settings = localStorage.getItem('settings');
        if (settings) {
            return JSON.parse(settings);
        }
        return { recentTimeframe: 30 }; // 30 days default
    },

    saveSettings: function(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
    }
};

