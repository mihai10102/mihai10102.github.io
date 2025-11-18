// Main application logic
const App = {
    currentPage: 'log',
    selectedSkill: null,

    init: function() {
        this.setupNavigation();
        this.setupWorkoutForm();
        this.setupExerciseManagement();
        this.setupSkills();
        this.setupProgress();
        this.loadLogs();
        this.populateExerciseSelects();
        this.setTodayDate();
    },

    // Navigation
    setupNavigation: function() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.showPage(page);
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },

    showPage: function(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        this.currentPage = pageName;

        // Refresh page-specific content
        if (pageName === 'log') {
            this.loadLogs();
        } else if (pageName === 'exercises') {
            this.loadExercises();
        } else if (pageName === 'skills') {
            this.renderSkillTree();
        } else if (pageName === 'progress') {
            this.updateProgressCharts();
        }
    },

    // Workout Logging
    setupWorkoutForm: function() {
        const form = document.getElementById('workout-form');
        const exerciseSelect = document.getElementById('exercise-select');
        const addSetGroupBtn = document.getElementById('add-set-group-btn');

        exerciseSelect.addEventListener('change', () => {
            this.updateWorkoutFormFields();
        });

        addSetGroupBtn.addEventListener('click', () => {
            this.addSetGroup();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWorkout();
        });
    },

    addSetGroup: function() {
        const container = document.getElementById('sets-container');
        const setGroup = document.createElement('div');
        setGroup.className = 'set-group';
        setGroup.innerHTML = `
            <input type="number" class="set-count" min="1" value="1" placeholder="Sets">
            <span>×</span>
            <input type="number" class="rep-count" min="0" value="0" placeholder="Reps">
            <button type="button" class="remove-set-group">Remove</button>
        `;
        container.appendChild(setGroup);
        
        // Add remove handler
        setGroup.querySelector('.remove-set-group').addEventListener('click', () => {
            const setGroups = container.querySelectorAll('.set-group');
            if (setGroups.length > 1) {
                setGroup.remove();
                this.updateRemoveButtons();
            }
        });
        
        this.updateRemoveButtons();
    },

    updateRemoveButtons: function() {
        const container = document.getElementById('sets-container');
        const setGroups = container.querySelectorAll('.set-group');
        setGroups.forEach((group, index) => {
            const removeBtn = group.querySelector('.remove-set-group');
            if (setGroups.length > 1) {
                removeBtn.style.display = 'inline-block';
            } else {
                removeBtn.style.display = 'none';
            }
        });
    },

    updateWorkoutFormFields: function() {
        const exerciseSelect = document.getElementById('exercise-select');
        const exerciseId = exerciseSelect.value;
        const exercise = Storage.getExercise(exerciseId);

        if (!exercise) {
            document.getElementById('reps-group').style.display = 'none';
            document.getElementById('time-group').style.display = 'none';
            document.getElementById('assistance-group').style.display = 'none';
            return;
        }

        if (exercise.type === 'reps') {
            document.getElementById('reps-group').style.display = 'block';
            document.getElementById('time-group').style.display = 'none';
            document.getElementById('assistance-group').style.display = 'none';
        } else if (exercise.type === 'time') {
            document.getElementById('reps-group').style.display = 'none';
            document.getElementById('time-group').style.display = 'flex';
            document.getElementById('assistance-group').style.display = 'none';
        } else if (exercise.type === 'weight') {
            document.getElementById('reps-group').style.display = 'block';
            document.getElementById('time-group').style.display = 'none';
            document.getElementById('assistance-group').style.display = 'flex';
        }
        
        // Reset sets container to have one set group
        const container = document.getElementById('sets-container');
        container.innerHTML = `
            <div class="set-group">
                <input type="number" class="set-count" min="1" value="1" placeholder="Sets">
                <span>×</span>
                <input type="number" class="rep-count" min="0" value="0" placeholder="Reps">
                <button type="button" class="remove-set-group" style="display: none;">Remove</button>
            </div>
        `;
        this.updateRemoveButtons();
    },

    saveWorkout: function() {
        const exerciseSelect = document.getElementById('exercise-select');
        const exerciseId = exerciseSelect.value;
        const exercise = Storage.getExercise(exerciseId);

        if (!exercise) {
            alert('Please select an exercise');
            return;
        }

        const log = {
            exerciseId: exerciseId,
            exerciseName: exercise.name,
            date: document.getElementById('workout-date').value,
            notes: document.getElementById('notes').value
        };

        if (exercise.type === 'reps' || exercise.type === 'weight') {
            // Collect all set groups
            const setGroups = [];
            const setGroupElements = document.querySelectorAll('.set-group');
            let totalReps = 0;
            
            setGroupElements.forEach(group => {
                const sets = parseInt(group.querySelector('.set-count').value) || 0;
                const reps = parseInt(group.querySelector('.rep-count').value) || 0;
                if (sets > 0 && reps > 0) {
                    setGroups.push({ sets: sets, reps: reps });
                    totalReps += sets * reps;
                }
            });
            
            if (setGroups.length === 0) {
                alert('Please enter at least one set');
                return;
            }
            
            log.setGroups = setGroups;
            log.totalReps = totalReps;
            // Keep legacy fields for backward compatibility
            log.sets = setGroups.reduce((sum, sg) => sum + sg.sets, 0);
            log.reps = setGroups.length > 0 ? setGroups[0].reps : 0; // First rep count for display
            
            if (exercise.type === 'weight') {
                log.assistance = document.getElementById('assistance').value;
            }
        } else if (exercise.type === 'time') {
            log.time = parseFloat(document.getElementById('time').value);
            if (!log.time || log.time <= 0) {
                alert('Please enter a valid time');
                return;
            }
        }

        Storage.saveLog(log);
        this.loadLogs();
        document.getElementById('workout-form').reset();
        this.setTodayDate();
        this.updateWorkoutFormFields();
    },

    loadLogs: function() {
        const logs = Storage.getLogs();
        const logsList = document.getElementById('logs-list');
        
        if (logs.length === 0) {
            logsList.innerHTML = '<p>No logs yet. Start logging your workouts!</p>';
            return;
        }

        // Group logs by date
        const logsByDate = {};
        logs.forEach(log => {
            if (!logsByDate[log.date]) {
                logsByDate[log.date] = [];
            }
            logsByDate[log.date].push(log);
        });

        // Sort dates descending
        const sortedDates = Object.keys(logsByDate).sort((a, b) => new Date(b) - new Date(a));

        let html = '';
        sortedDates.forEach(date => {
            html += `<div class="log-date-group">
                <h3>${new Date(date).toLocaleDateString()}</h3>
                <div class="log-items">`;
            
            logsByDate[date].forEach(log => {
                html += this.renderLogItem(log);
            });
            
            html += `</div></div>`;
        });

        logsList.innerHTML = html;

        // Add delete handlers
        document.querySelectorAll('.delete-log').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const logId = e.target.dataset.logId;
                if (confirm('Delete this log?')) {
                    Storage.deleteLog(logId);
                    this.loadLogs();
                }
            });
        });
    },

    renderLogItem: function(log) {
        let content = `<div class="log-item">
            <strong>${log.exerciseName}</strong> - `;
        
        if (log.totalReps !== undefined) {
            // Check if we have setGroups (new format) or legacy format
            if (log.setGroups && log.setGroups.length > 0) {
                // Display all set groups
                const setGroupStrings = log.setGroups.map(sg => `${sg.sets}×${sg.reps}`);
                content += setGroupStrings.join(' + ') + ` = ${log.totalReps} reps`;
            } else {
                // Legacy format
                content += `${log.sets}×${log.reps} = ${log.totalReps} reps`;
            }
        } else if (log.time !== undefined) {
            content += `${log.time}s`;
        }
        
        if (log.assistance) {
            content += ` (${log.assistance})`;
        }
        
        if (log.notes) {
            content += `<br><em>${log.notes}</em>`;
        }
        
        content += `<button class="delete-log" data-log-id="${log.id}">Delete</button>
        </div>`;
        
        return content;
    },

    // Exercise Management
    setupExerciseManagement: function() {
        const addBtn = document.getElementById('add-exercise-btn');
        const modal = document.getElementById('exercise-modal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-exercise');
        const form = document.getElementById('exercise-form');

        addBtn.addEventListener('click', () => {
            this.openExerciseModal();
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExercise();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    },

    openExerciseModal: function(exercise = null) {
        const modal = document.getElementById('exercise-modal');
        const form = document.getElementById('exercise-form');
        const title = document.getElementById('modal-title');
        
        if (exercise) {
            title.textContent = 'Edit Exercise';
            document.getElementById('exercise-id').value = exercise.id;
            document.getElementById('exercise-name').value = exercise.name;
            document.getElementById('exercise-type').value = exercise.type;
        } else {
            title.textContent = 'Add Exercise';
            form.reset();
            document.getElementById('exercise-id').value = '';
        }
        
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    },

    saveExercise: function() {
        const id = document.getElementById('exercise-id').value;
        const name = document.getElementById('exercise-name').value;
        const type = document.getElementById('exercise-type').value;

        const exercise = {
            id: id || name.toLowerCase().replace(/\s+/g, '_'),
            name: name,
            type: type
        };

        Storage.saveExercise(exercise);
        this.loadExercises();
        this.populateExerciseSelects();
        document.getElementById('exercise-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    },

    loadExercises: function() {
        const exercises = Storage.getExercises();
        const list = document.getElementById('exercises-list');

        if (exercises.length === 0) {
            list.innerHTML = '<p>No exercises yet. Add your first exercise!</p>';
            return;
        }

        let html = '<div class="exercises-grid">';
        exercises.forEach(exercise => {
            html += `<div class="exercise-card">
                <h3>${exercise.name}</h3>
                <p>Type: ${exercise.type}</p>
                <button class="edit-exercise" data-exercise-id="${exercise.id}">Edit</button>
                <button class="delete-exercise" data-exercise-id="${exercise.id}">Delete</button>
            </div>`;
        });
        html += '</div>';

        list.innerHTML = html;

        // Add event handlers
        document.querySelectorAll('.edit-exercise').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.dataset.exerciseId;
                const exercise = Storage.getExercise(exerciseId);
                this.openExerciseModal(exercise);
            });
        });

        document.querySelectorAll('.delete-exercise').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.dataset.exerciseId;
                if (confirm('Delete this exercise? This will also delete related logs.')) {
                    Storage.deleteExercise(exerciseId);
                    // Also delete related logs
                    const logs = Storage.getLogs();
                    const filtered = logs.filter(log => log.exerciseId !== exerciseId);
                    localStorage.setItem('logs', JSON.stringify(filtered));
                    this.loadExercises();
                    this.populateExerciseSelects();
                    this.loadLogs();
                }
            });
        });
    },

    populateExerciseSelects: function() {
        const exercises = Storage.getExercises();
        const selects = ['exercise-select', 'progress-exercise-select'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select an exercise...</option>';
            
            exercises.forEach(exercise => {
                const option = document.createElement('option');
                option.value = exercise.id;
                option.textContent = exercise.name;
                select.appendChild(option);
            });
            
            if (currentValue) {
                select.value = currentValue;
            }
        });
    },

    // Skills System
    setupSkills: function() {
        const backBtn = document.getElementById('back-to-tree');
        backBtn.addEventListener('click', () => {
            document.getElementById('skill-tree-view').style.display = 'block';
            document.getElementById('skill-detail-view').style.display = 'none';
            document.getElementById('edit-skill-btn').style.display = 'none';
            this.selectedSkill = null;
            this.renderSkillTree();
        });

        const addSkillBtn = document.getElementById('add-skill-btn');
        addSkillBtn.addEventListener('click', () => {
            this.openSkillModal();
        });

        const editSkillBtn = document.getElementById('edit-skill-btn');
        editSkillBtn.addEventListener('click', () => {
            if (this.selectedSkill) {
                this.openSkillModal(this.selectedSkill);
            }
        });

        const skillModal = document.getElementById('skill-modal');
        const closeSkillModal = document.getElementById('close-skill-modal');
        const cancelSkillBtn = document.getElementById('cancel-skill');
        const skillForm = document.getElementById('skill-form');
        const addRequirementBtn = document.getElementById('add-requirement-btn');

        closeSkillModal.addEventListener('click', () => {
            skillModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        cancelSkillBtn.addEventListener('click', () => {
            skillModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        });

        addRequirementBtn.addEventListener('click', () => {
            this.addRequirementField();
        });

        skillForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSkill();
        });

        window.addEventListener('click', (e) => {
            if (e.target === skillModal) {
                skillModal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }
        });
    },

    calculateSkillProgress: function(skill) {
        const settings = Storage.getSettings();
        const timeframe = settings.recentTimeframe || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeframe);

        const requirementProgress = skill.requirements.map(req => {
            const logs = Storage.getLogs()
                .filter(log => {
                    const logDate = new Date(log.date);
                    return log.exerciseId === req.exerciseId && logDate >= cutoffDate;
                });

            if (logs.length === 0) return 0;

            let bestValue = 0;
            logs.forEach(log => {
                let value = 0;
                if (req.type === 'reps') {
                    value = log.totalReps || 0;
                } else if (req.type === 'time') {
                    value = log.time || 0;
                }
                bestValue = Math.max(bestValue, value);
            });

            const progress = Math.min(bestValue / req.targetValue, 1);
            return progress;
        });

        const avgProgress = requirementProgress.reduce((a, b) => a + b, 0) / requirementProgress.length;
        const isUnlocked = requirementProgress.every(p => p >= 1);

        return {
            progress: avgProgress,
            isUnlocked: isUnlocked,
            requirementProgress: requirementProgress
        };
    },

    renderSkillTree: function() {
        const canvas = document.getElementById('skill-tree-canvas');
        const skills = Storage.getSkills();
        const containerWidth = canvas.parentElement.clientWidth;
        const isMobileLayout = containerWidth < 768;
        
        if (skills.length === 0) {
            canvas.width = containerWidth;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = isMobileLayout ? '14px Arial' : '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No skills yet. Click "Add Skill" to create your first skill!', canvas.width / 2, canvas.height / 2);
            return;
        }

        canvas.width = containerWidth;
        const ctx = canvas.getContext('2d');

        // Calculate positions based on layout
        let nodeWidth, nodeHeight, spacing, columns, startX, startY;
        
        if (isMobileLayout) {
            // Mobile: single column, vertical layout
            nodeWidth = Math.min(containerWidth - 40, 280);
            nodeHeight = 80;
            spacing = 120;
            columns = 1;
            startX = (containerWidth - nodeWidth) / 2;
            startY = 50;
        } else {
            // Desktop: multi-column grid
            nodeWidth = 200;
            nodeHeight = 100;
            spacing = 250;
            columns = 3;
            startX = 150;
            startY = 100;
        }

        // Calculate canvas height based on layout
        const rows = Math.ceil(skills.length / columns);
        const canvasHeight = startY + (rows * spacing) + 50;
        canvas.height = Math.max(600, canvasHeight);

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        skills.forEach((skill, index) => {
            let x, y;
            
            if (isMobileLayout) {
                // Vertical layout for mobile
                x = startX;
                y = startY + (index * spacing);
            } else {
                // Grid layout for desktop
                x = startX + (index % columns) * spacing;
                y = startY + Math.floor(index / columns) * spacing;
            }
            
            skill.x = x;
            skill.y = y;

            // Draw connections to dependencies
            if (skill.dependencies && skill.dependencies.length > 0) {
                skill.dependencies.forEach(depId => {
                    const depSkill = skills.find(s => s.id === depId);
                    if (depSkill && depSkill.x && depSkill.y) {
                        ctx.strokeStyle = '#999';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(depSkill.x + nodeWidth / 2, depSkill.y + nodeHeight);
                        ctx.lineTo(x + nodeWidth / 2, y);
                        ctx.stroke();
                    }
                });
            }

            // Calculate progress
            const progressData = this.calculateSkillProgress(skill);
            
            // Draw node
            let color = '#ccc'; // locked
            if (progressData.isUnlocked) {
                color = '#4caf50'; // unlocked
            } else if (progressData.progress > 0) {
                color = '#ff9800'; // in progress
            }

            ctx.fillStyle = color;
            ctx.fillRect(x, y, nodeWidth, nodeHeight);
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, nodeWidth, nodeHeight);

            // Draw text
            ctx.fillStyle = '#000';
            const nameFontSize = isMobileLayout ? '12px' : '14px';
            const textFontSize = isMobileLayout ? '10px' : '12px';
            ctx.font = `bold ${nameFontSize} Arial`;
            ctx.textAlign = 'center';
            
            // Word wrap for long skill names on mobile
            const textY = isMobileLayout ? y + 28 : y + 30;
            ctx.fillText(skill.name, x + nodeWidth / 2, textY);
            
            ctx.font = textFontSize + ' Arial';
            const progressText = progressData.isUnlocked 
                ? 'Unlocked!' 
                : `${Math.round(progressData.progress * 100)}%`;
            const progressY = isMobileLayout ? y + 50 : y + 55;
            ctx.fillText(progressText, x + nodeWidth / 2, progressY);
        });

        // Add click handlers - remove existing listener to prevent duplicates
        canvas.removeEventListener('click', this.skillTreeClickHandler);
        this.skillTreeClickHandler = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            // Check skills in reverse order (last drawn = topmost) and stop at first match
            // Need to get current layout dimensions for click detection
            const currentWidth = canvas.width;
            const isMobile = currentWidth < 768;
            const clickNodeWidth = isMobile ? Math.min(currentWidth - 40, 280) : 200;
            const clickNodeHeight = isMobile ? 80 : 100;
            
            for (let i = skills.length - 1; i >= 0; i--) {
                const skill = skills[i];
                if (skill.x !== undefined && skill.y !== undefined && 
                    x >= skill.x && x <= skill.x + clickNodeWidth &&
                    y >= skill.y && y <= skill.y + clickNodeHeight) {
                    this.showSkillDetail(skill);
                    return; // Stop after first match
                }
            }
        };
        canvas.addEventListener('click', this.skillTreeClickHandler);
        
        // Add resize handler to re-render on window resize
        if (!this.resizeHandler) {
            let resizeTimeout;
            this.resizeHandler = () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (this.currentPage === 'skills') {
                        this.renderSkillTree();
                    }
                }, 250); // Debounce resize events
            };
            window.addEventListener('resize', this.resizeHandler);
        }
    },

    showSkillDetail: function(skill) {
        const progressData = this.calculateSkillProgress(skill);
        const detailView = document.getElementById('skill-detail-view');
        const detailContent = document.getElementById('skill-detail-content');
        const treeView = document.getElementById('skill-tree-view');

        treeView.style.display = 'none';
        detailView.style.display = 'block';

        let html = `<h2>${skill.name}</h2>`;
        html += `<p>${skill.description || 'No description'}</p>`;
        html += `<div class="skill-progress-bar">
            <div class="progress-fill" style="width: ${progressData.progress * 100}%"></div>
            <span>${Math.round(progressData.progress * 100)}% Complete</span>
        </div>`;
        
        if (progressData.isUnlocked) {
            html += `<p class="unlocked-badge">✓ Unlocked!</p>`;
        }

        html += `<h3>Requirements:</h3><ul class="requirements-list">`;
        
        skill.requirements.forEach((req, index) => {
            const reqProgress = progressData.requirementProgress[index];
            const exercise = Storage.getExercise(req.exerciseId);
            const exerciseName = exercise ? exercise.name : req.exerciseId;
            
            html += `<li class="requirement-item">
                <div class="requirement-header">
                    <strong>${req.description || exerciseName}</strong>
                    <span>${Math.round(reqProgress * 100)}%</span>
                </div>
                <div class="requirement-progress-bar">
                    <div class="progress-fill" style="width: ${reqProgress * 100}%"></div>
                </div>
                <p>Target: ${req.targetValue} ${req.type === 'time' ? 'seconds' : req.type === 'reps' ? 'reps' : ''}</p>
            </li>`;
        });
        
        html += `</ul>`;

        // Show related logs
        const settings = Storage.getSettings();
        const timeframe = settings.recentTimeframe || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timeframe);

        const relatedLogs = Storage.getLogs()
            .filter(log => {
                const logDate = new Date(log.date);
                return skill.requirements.some(req => req.exerciseId === log.exerciseId) &&
                       logDate >= cutoffDate;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        if (relatedLogs.length > 0) {
            html += `<h3>Recent Logs:</h3><ul class="logs-list">`;
            relatedLogs.forEach(log => {
                html += `<li>${new Date(log.date).toLocaleDateString()} - ${log.exerciseName}: `;
                if (log.totalReps !== undefined) {
                    html += `${log.totalReps} reps`;
                } else if (log.time !== undefined) {
                    html += `${log.time}s`;
                }
                html += `</li>`;
            });
            html += `</ul>`;
        }

        detailContent.innerHTML = html;
        this.selectedSkill = skill;
        document.getElementById('edit-skill-btn').style.display = 'inline-block';
    },

    openSkillModal: function(skill = null) {
        const modal = document.getElementById('skill-modal');
        const form = document.getElementById('skill-form');
        const title = document.getElementById('skill-modal-title');
        const requirementsList = document.getElementById('requirements-list');
        
        if (skill) {
            title.textContent = 'Edit Skill';
            document.getElementById('skill-id-input').value = skill.id;
            document.getElementById('skill-name-input').value = skill.name;
            document.getElementById('skill-description-input').value = skill.description || '';
            document.getElementById('skill-dependencies-input').value = (skill.dependencies || []).join(', ');
            
            requirementsList.innerHTML = '';
            if (skill.requirements && skill.requirements.length > 0) {
                skill.requirements.forEach((req, index) => {
                    this.addRequirementField(req, index);
                });
            } else {
                this.addRequirementField();
            }
        } else {
            title.textContent = 'Add Skill';
            form.reset();
            document.getElementById('skill-id-input').value = '';
            requirementsList.innerHTML = '';
            this.addRequirementField();
        }
        
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    },

    addRequirementField: function(requirement = null, index = null) {
        const requirementsList = document.getElementById('requirements-list');
        const reqIndex = index !== null ? index : requirementsList.children.length;
        const exercises = Storage.getExercises();
        
        const reqDiv = document.createElement('div');
        reqDiv.className = 'requirement-field';
        reqDiv.style.marginBottom = '1rem';
        reqDiv.style.padding = '1rem';
        reqDiv.style.backgroundColor = '#f9f9f9';
        reqDiv.style.borderRadius = '4px';
        
        let html = `
            <div class="form-group">
                <label>Exercise:</label>
                <select class="req-exercise" required>
                    <option value="">Select exercise...</option>
        `;
        exercises.forEach(ex => {
            const selected = requirement && requirement.exerciseId === ex.id ? 'selected' : '';
            html += `<option value="${ex.id}" ${selected}>${ex.name}</option>`;
        });
        html += `</select></div>`;
        
        html += `
            <div class="form-group">
                <label>Type:</label>
                <select class="req-type" required>
                    <option value="reps" ${requirement && requirement.type === 'reps' ? 'selected' : ''}>Reps</option>
                    <option value="time" ${requirement && requirement.type === 'time' ? 'selected' : ''}>Time</option>
                </select>
            </div>
        `;
        
        html += `
            <div class="form-group">
                <label>Target Value:</label>
                <input type="number" class="req-target" min="0" step="0.1" value="${requirement ? requirement.targetValue : ''}" required>
            </div>
        `;
        
        html += `
            <div class="form-group">
                <label>Description (optional):</label>
                <input type="text" class="req-description" value="${requirement ? (requirement.description || '') : ''}" placeholder="e.g., 6×5 band-assisted pull-ups">
            </div>
        `;
        
        html += `<button type="button" class="delete-requirement btn-secondary" style="background-color: #f44336;">Remove</button>`;
        
        reqDiv.innerHTML = html;
        requirementsList.appendChild(reqDiv);
        
        // Add delete handler
        reqDiv.querySelector('.delete-requirement').addEventListener('click', () => {
            reqDiv.remove();
        });
    },

    saveSkill: function() {
        const id = document.getElementById('skill-id-input').value;
        const name = document.getElementById('skill-name-input').value;
        const description = document.getElementById('skill-description-input').value;
        const dependenciesInput = document.getElementById('skill-dependencies-input').value;
        const dependencies = dependenciesInput ? dependenciesInput.split(',').map(d => d.trim()).filter(d => d) : [];
        
        const requirements = [];
        const requirementFields = document.querySelectorAll('.requirement-field');
        requirementFields.forEach(field => {
            const exerciseId = field.querySelector('.req-exercise').value;
            const type = field.querySelector('.req-type').value;
            const targetValue = parseFloat(field.querySelector('.req-target').value);
            const description = field.querySelector('.req-description').value;
            
            if (exerciseId && type && !isNaN(targetValue)) {
                requirements.push({
                    exerciseId: exerciseId,
                    type: type,
                    targetValue: targetValue,
                    description: description || undefined
                });
            }
        });
        
        if (requirements.length === 0) {
            alert('Please add at least one requirement');
            return;
        }
        
        const skill = {
            id: id || name.toLowerCase().replace(/\s+/g, '_'),
            name: name,
            description: description,
            requirements: requirements,
            dependencies: dependencies
        };
        
        Storage.saveSkill(skill);
        document.getElementById('skill-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
        this.renderSkillTree();
        
        // If we were viewing this skill, refresh the detail view
        if (this.selectedSkill && this.selectedSkill.id === skill.id) {
            this.showSkillDetail(skill);
        }
    },

    // Progress Charts
    setupProgress: function() {
        const select = document.getElementById('progress-exercise-select');
        select.addEventListener('change', () => {
            this.updateProgressCharts();
        });
    },

    updateProgressCharts: function() {
        const exerciseId = document.getElementById('progress-exercise-select').value;
        if (!exerciseId) {
            document.getElementById('progress-chart').getContext('2d').clearRect(0, 0, 800, 400);
            document.getElementById('volume-chart').getContext('2d').clearRect(0, 0, 800, 400);
            return;
        }

        const exercise = Storage.getExercise(exerciseId);
        const logs = Storage.getLogs()
            .filter(log => log.exerciseId === exerciseId)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        this.drawProgressChart(logs, exercise);
        this.drawVolumeChart(logs, exercise);
    },

    drawProgressChart: function(logs, exercise) {
        const canvas = document.getElementById('progress-chart');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth - 40;
        canvas.height = 300;

        if (logs.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        const padding = 50;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Get max value
        let maxValue = 0;
        logs.forEach(log => {
            const value = exercise.type === 'time' ? log.time : log.totalReps;
            maxValue = Math.max(maxValue, value || 0);
        });
        maxValue = Math.max(maxValue, 1);

        // Draw data points and lines
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#2196F3';

        logs.forEach((log, index) => {
            const x = padding + (index / (logs.length - 1 || 1)) * chartWidth;
            const value = exercise.type === 'time' ? log.time : log.totalReps;
            const y = canvas.height - padding - ((value || 0) / maxValue) * chartHeight;

            if (index > 0) {
                const prevLog = logs[index - 1];
                const prevValue = exercise.type === 'time' ? prevLog.time : prevLog.totalReps;
                const prevX = padding + ((index - 1) / (logs.length - 1 || 1)) * chartWidth;
                const prevY = canvas.height - padding - ((prevValue || 0) / maxValue) * chartHeight;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Date label
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const date = new Date(log.date);
            ctx.fillText(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x, canvas.height - padding + 20);
            ctx.fillStyle = '#2196F3';
        });

        // Y-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue / 5) * i;
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(Math.round(value).toString(), padding - 10, y + 4);
        }
    },

    drawVolumeChart: function(logs, exercise) {
        const canvas = document.getElementById('volume-chart');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth - 40;
        canvas.height = 300;

        if (logs.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Group by week
        const weeklyData = {};
        logs.forEach(log => {
            const date = new Date(log.date);
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];

            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = 0;
            }

            const value = exercise.type === 'time' ? log.time : log.totalReps;
            weeklyData[weekKey] += value || 0;
        });

        const weeks = Object.keys(weeklyData).sort();
        const values = weeks.map(week => weeklyData[week]);
        const maxValue = Math.max(...values, 1);

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw axes
        const padding = 50;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw bars
        const barWidth = chartWidth / weeks.length;
        ctx.fillStyle = '#4CAF50';

        weeks.forEach((week, index) => {
            const x = padding + index * barWidth;
            const value = values[index];
            const barHeight = (value / maxValue) * chartHeight;
            const y = canvas.height - padding - barHeight;

            ctx.fillRect(x, y, barWidth - 2, barHeight);

            // Week label
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const weekDate = new Date(week);
            ctx.fillText(weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), x + barWidth / 2, canvas.height - padding + 20);
            ctx.fillStyle = '#4CAF50';
        });

        // Y-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = (maxValue / 5) * i;
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(Math.round(value).toString(), padding - 10, y + 4);
        }
    },

    setTodayDate: function() {
        const dateInput = document.getElementById('workout-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

