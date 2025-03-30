
       document.addEventListener('DOMContentLoaded', function() {
        const loginContainer = document.getElementById('login-container');
        const loginPanel = document.getElementById('login-panel');
        const registerPanel = document.getElementById('register-panel');
        const dashboard = document.getElementById('dashboard');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');
        const registerErrorMessage = document.getElementById('register-error-message');
        const registerLink = document.getElementById('register-link');
        const loginLink = document.getElementById('login-link');
        const themeToggle = document.getElementById('theme-toggle');
        const logoutBtn = document.getElementById('logout-btn');
        const usernameDisplay = document.getElementById('username-display');
        const userAvatar = document.getElementById('user-avatar');
        const mainTitle = document.getElementById('main-title');
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');
    
        
        checkAuth();
    
        
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginPanel.style.display = 'none';
            registerPanel.style.display = 'flex';
        });
    
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerPanel.style.display = 'none';
            loginPanel.style.display = 'flex';
        });
    
        // Login
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
    
            authenticateUser(username, password);
        });
    
        // Registro
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
    
            if (!username || !password || !confirmPassword) {
                showRegisterError('Preencha todos os campos');
                return;
            }
    
            if (password !== confirmPassword) {
                showRegisterError('As senhas não coincidem');
                return;
            }
    
            if (password.length < 6) {
                showRegisterError('A senha deve ter pelo menos 6 caracteres');
                return;
            }
    
            registerUser(username, password);
        });
    
        
        themeToggle.addEventListener('click', toggleTheme);
    
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    
        
        navItems.forEach(item => {
            if (item.dataset.section) {
                item.addEventListener('click', function() {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    const sectionId = this.dataset.section;
                    sections.forEach(section => section.classList.remove('active'));
                    document.getElementById(sectionId).classList.add('active');
                    
                    mainTitle.textContent = this.textContent.trim();
                });
            }
        });
    
        
        function checkAuth() {
            const loggedIn = localStorage.getItem('loggedIn') === 'true';
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
            if (loggedIn && currentUser) {
                showDashboard(currentUser);
            } else {
                showLogin();
            }
        }
    
        function authenticateUser(username, password) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
    
            if (user) {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify(user));
                showDashboard(user);
            } else {
                showLoginError();
            }
        }
    
        function registerUser(username, password) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.username === username)) {
                showRegisterError('Usuário já existe');
                return;
            }
    
            const newUser = {
                username,
                password,
                createdAt: new Date().toISOString(),
                workouts: [],
                weightHistory: []
            };
    
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            
            initializeUserData(newUser.username);
            
          
            showDashboard(newUser);
           
            document.getElementById('reg-username').value = '';
            document.getElementById('reg-password').value = '';
            document.getElementById('reg-confirm-password').value = '';
        }
    
        function initializeUserData(username) {
            
            const today = new Date();
            
            
            const weightHistory = [
                { 
                    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString(), 
                    weight: 70, 
                    bodyFat: 20 
                },
                { 
                    date: today.toISOString(), 
                    weight: 70, 
                    bodyFat: 20 
                }
            ];
            
       
            const strengthHistory = [
                { 
                    date: today.toISOString(), 
                    exercise: 'Supino Reto', 
                    maxWeight: 40, 
                    maxReps: 8 
                }
            ];
            
            
            localStorage.setItem(`${username}_workouts`, JSON.stringify([]));
            localStorage.setItem(`${username}_weightHistory`, JSON.stringify(weightHistory));
            localStorage.setItem(`${username}_strengthHistory`, JSON.stringify(strengthHistory));
        }
    
        function showDashboard(user) {
            loginContainer.style.display = 'none';
            dashboard.style.display = 'block';
            
            if (user) {
                usernameDisplay.textContent = user.username;
                userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=2ecc71&color=fff`;
            }
            
            initializeDashboard();
        }
    
        function showLogin() {
            loginContainer.style.display = 'flex';
            dashboard.style.display = 'none';
            loginPanel.style.display = 'flex';
            registerPanel.style.display = 'none';
            
            
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    
        function showLoginError() {
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    
        function showRegisterError(message) {
            registerErrorMessage.textContent = message;
            registerErrorMessage.style.display = 'block';
            setTimeout(() => {
                registerErrorMessage.style.display = 'none';
            }, 3000);
        }
    
        function logout() {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentUser');
            showLogin();
        }
    
       
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        }
    
      
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    
        
        function initializeDashboard() {
            initializeStorage();
            loadDashboardData();
            loadWorkoutHistory();
            initCharts();
            setupEventListeners();
            
            
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('workout-date').value = today;
            document.getElementById('weight-date').value = today;
            document.getElementById('weight-date-2').value = today;
        }
    
        
        function initializeStorage() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            if (!localStorage.getItem(`${currentUser.username}_workouts`)) {
                localStorage.setItem(`${currentUser.username}_workouts`, JSON.stringify([]));
            }
            
            if (!localStorage.getItem(`${currentUser.username}_weightHistory`)) {
                const today = new Date();
                const weightHistory = [
                    { date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString(), weight: 80, bodyFat: 18 },
                    { date: today.toISOString(), weight: 78, bodyFat: 16.5 }
                ];
                localStorage.setItem(`${currentUser.username}_weightHistory`, JSON.stringify(weightHistory));
            }
            
            if (!localStorage.getItem(`${currentUser.username}_strengthHistory`)) {
                const today = new Date();
                const strengthHistory = [
                    { date: today.toISOString(), exercise: 'Supino Reto', maxWeight: 85, maxReps: 5 }
                ];
                localStorage.setItem(`${currentUser.username}_strengthHistory`, JSON.stringify(strengthHistory));
            }
        }
    
        function loadDashboardData() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
            const today = new Date();
            const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            
            const workoutsThisWeek = workouts.filter(workout => {
                const workoutDate = new Date(workout.date);
                return workoutDate >= oneWeekAgo;
            });
            
            document.getElementById('workouts-week').textContent = workoutsThisWeek.length;
            
            const weightHistory = JSON.parse(localStorage.getItem(`${currentUser.username}_weightHistory`) || []);
            if (weightHistory.length > 0) {
                const latestWeight = weightHistory[weightHistory.length - 1];
                document.getElementById('current-weight').textContent = `${latestWeight.weight}kg`;
            }
            
            let totalReps = 0;
            let totalSets = 0;
            let maxWeight = 0;
            
            workouts.forEach(workout => {
                workout.exercises.forEach(exercise => {
                    exercise.sets.forEach(set => {
                        totalReps += set.reps;
                        totalSets++;
                        if (set.weight > maxWeight) {
                            maxWeight = set.weight;
                        }
                    });
                });
            });
            
            const avgReps = totalSets > 0 ? Math.round(totalReps / totalSets) : 0;
            document.getElementById('avg-reps').textContent = avgReps;
            document.getElementById('max-weight').textContent = `${maxWeight}kg`;
        }
    
        function loadWorkoutHistory() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
            const tbody = document.getElementById('workout-history-body');
            tbody.innerHTML = '';
            
            if (workouts.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum treino registrado ainda</td></tr>';
                return;
            }
            
            workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            workouts.forEach((workout, index) => {
                const row = document.createElement('tr');
                const date = new Date(workout.date);
                
                row.innerHTML = `
                    <td>${date.toLocaleDateString()}</td>
                    <td>${getWorkoutTypeName(workout.type)}</td>
                    <td>${workout.exercises.length} exercícios</td>
                    <td>
                        <button class="action-btn view-workout" data-index="${index}">👁️ Ver</button>
                        <button class="action-btn delete-workout" data-index="${index}">🗑️ Excluir</button>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
            
            document.querySelectorAll('.view-workout').forEach(btn => {
                btn.addEventListener('click', function() {
                    viewWorkout(parseInt(this.getAttribute('data-index')));
                });
            });
            
            document.querySelectorAll('.delete-workout').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('Tem certeza que deseja excluir este treino?')) {
                        deleteWorkout(parseInt(this.getAttribute('data-index')));
                    }
                });
            });
        }
    
        function getWorkoutTypeName(type) {
            const types = {
                'peito': 'Peito',
                'costas': 'Costas',
                'pernas': 'Pernas',
                'ombros': 'Ombros',
                'braços': 'Braços',
                'cardio': 'Cardio',
                'fullbody': 'Full Body'
            };
            return types[type] || type;
        }
    
        function viewWorkout(index) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
            const workout = workouts[index];
            const modal = document.getElementById('workout-modal');
            const modalTitle = document.getElementById('modal-workout-title');
            const modalContent = document.getElementById('modal-workout-content');
            
            const date = new Date(workout.date);
            modalTitle.textContent = `Treino de ${getWorkoutTypeName(workout.type)} - ${date.toLocaleDateString()}`;
            
            let content = '<div class="workout-details">';
            
            workout.exercises.forEach(exercise => {
                content += `<h3>${exercise.name}</h3>`;
                content += '<table class="exercise-table">';
                content += '<tr><th>Série</th><th>Peso (kg)</th><th>Repetições</th></tr>';
                
                exercise.sets.forEach((set, i) => {
                    content += `<tr><td>${i + 1}</td><td>${set.weight}</td><td>${set.reps}</td></tr>`;
                });
                
                const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
                const avgWeight = exercise.sets.reduce((sum, set) => sum + set.weight, 0) / exercise.sets.length;
                const avgReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0) / exercise.sets.length;
                
                content += `<tr class="summary-row"><td colspan="3">Máximo: ${maxWeight}kg | Média: ${avgWeight.toFixed(1)}kg / ${avgReps.toFixed(1)} reps</td></tr>`;
                content += '</table>';
            });
            
            content += '</div>';
            modalContent.innerHTML = content;
            
            modal.style.display = 'flex';
            
            document.querySelector('.close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    
        function deleteWorkout(index) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
            workouts.splice(index, 1);
            localStorage.setItem(`${currentUser.username}_workouts`, JSON.stringify(workouts));
            loadWorkoutHistory();
            loadDashboardData();
            initCharts();
        }
    
        function initCharts() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            // Gráfico de peso
            const weightHistory = JSON.parse(localStorage.getItem(`${currentUser.username}_weightHistory`) || []);
            if (weightHistory.length > 0) {
                const weightCtx = document.getElementById('weightChart').getContext('2d');
                const weightDates = weightHistory.map(entry => new Date(entry.date).toLocaleDateString());
                const weights = weightHistory.map(entry => entry.weight);
                const bodyFat = weightHistory.map(entry => entry.bodyFat || null);
                
                new Chart(weightCtx, {
                    type: 'line',
                    data: {
                        labels: weightDates,
                        datasets: [
                            {
                                label: 'Peso (kg)',
                                data: weights,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                                yAxisID: 'y'
                            },
                            {
                                label: '% Gordura Corporal',
                                data: bodyFat,
                                borderColor: 'rgb(255, 99, 132)',
                                tension: 0.1,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Peso (kg)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: '% Gordura'
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                                min: Math.min(...bodyFat.filter(Boolean)) - 2,
                                max: Math.max(...bodyFat.filter(Boolean)) + 2
                            }
                        }
                    }
                });
            }
            
            
            const strengthHistory = JSON.parse(localStorage.getItem(`${currentUser.username}_strengthHistory`) || []);
            if (strengthHistory.length > 0) {
                const strengthCtx = document.getElementById('strengthChart').getContext('2d');
                const strengthDates = strengthHistory.map(entry => new Date(entry.date).toLocaleDateString());
                const maxWeights = strengthHistory.map(entry => entry.maxWeight);
                const maxReps = strengthHistory.map(entry => entry.maxReps);
                
                new Chart(strengthCtx, {
                    type: 'line',
                    data: {
                        labels: strengthDates,
                        datasets: [
                            {
                                label: 'Carga Máxima (kg)',
                                data: maxWeights,
                                borderColor: 'rgb(54, 162, 235)',
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                tension: 0.1,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Repetições Máximas',
                                data: maxReps,
                                borderColor: 'rgb(255, 159, 64)',
                                backgroundColor: 'rgba(255, 159, 64, 0.5)',
                                tension: 0.1,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Peso (kg)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Repetições'
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                                min: 0,
                                max: Math.max(...maxReps) + 2
                            }
                        }
                    }
                });
            }
            
            
            initAdditionalCharts();
        }
    
        function initAdditionalCharts() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (!currentUser) return;
    
            
            const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
            if (workouts.length > 0) {
                
            }
        }
    
        function setupEventListeners() {
            
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });
           
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('add-set')) {
                    const setsContainer = e.target.previousElementSibling;
                    const setCount = setsContainer.querySelectorAll('.exercise-set').length;
                    
                    const newSet = document.createElement('div');
                    newSet.className = 'exercise-set';
                    newSet.innerHTML = `
                        <input type="number" placeholder="Série" class="set-number" value="${setCount + 1}" readonly>
                        <input type="number" placeholder="Peso (kg)" class="set-weight" required>
                        <input type="number" placeholder="Repetições" class="set-reps" required>
                        <span class="remove-set">❌</span>
                    `;
                    
                    setsContainer.appendChild(newSet);
                }
               
                if (e.target.classList.contains('remove-set')) {
                    const set = e.target.parentElement;
                    const setsContainer = set.parentElement;
                    
                    if (setsContainer.querySelectorAll('.exercise-set').length > 1) {
                        set.remove();
                        
                        
                        const sets = setsContainer.querySelectorAll('.exercise-set');
                        sets.forEach((s, i) => {
                            s.querySelector('.set-number').value = i + 1;
                        });
                    } else {
                        alert('Cada exercício deve ter pelo menos uma série.');
                    }
                }
            });
            
         
            document.getElementById('add-exercise').addEventListener('click', function() {
                const exercisesContainer = document.getElementById('exercises-container');
                
                const newExercise = document.createElement('div');
                newExercise.className = 'exercise';
                newExercise.innerHTML = `
                    <div class="form-group">
                        <label for="exercise-name">Exercício</label>
                        <input type="text" class="exercise-name" placeholder="Ex: Supino Reto" required>
                    </div>
                    <div class="sets-container">
                        <div class="exercise-set">
                            <input type="number" placeholder="Série" class="set-number" value="1" readonly>
                            <input type="number" placeholder="Peso (kg)" class="set-weight" required>
                            <input type="number" placeholder="Repetições" class="set-reps" required>
                            <span class="remove-set">❌</span>
                        </div>
                    </div>
                    <span class="add-set">+ Adicionar Série</span>
                `;
                
                exercisesContainer.appendChild(newExercise);
            });
            
           
            document.getElementById('save-workout').addEventListener('click', function() {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                if (!currentUser) {
                    alert('Usuário não autenticado. Faça login novamente.');
                    return;
                }
    
                const date = document.getElementById('workout-date').value;
                const type = document.getElementById('workout-type').value;
                
                if (!date || !type) {
                    alert('Por favor, preencha a data e o tipo de treino.');
                    return;
                }
                
                const exercises = [];
                let hasError = false;
                
                document.querySelectorAll('.exercise').forEach(exerciseEl => {
                    const name = exerciseEl.querySelector('.exercise-name').value;
                    
                    if (!name) {
                        alert('Por favor, preencha o nome de todos os exercícios.');
                        hasError = true;
                        return;
                    }
                    
                    const sets = [];
                    exerciseEl.querySelectorAll('.exercise-set').forEach(setEl => {
                        const weightInput = setEl.querySelector('.set-weight');
                        const repsInput = setEl.querySelector('.set-reps');
                        
                        const weight = parseFloat(weightInput.value);
                        const reps = parseInt(repsInput.value);
                        
                        if (isNaN(weight) || isNaN(reps)) {
                            alert(`Preencha peso e repetições válidos para todas as séries do exercício ${name}.`);
                            hasError = true;
                            return;
                        }
                        
                        sets.push({ weight, reps });
                    });
                    
                    if (!hasError) {
                        exercises.push({ name, sets });
                    }
                });
                
                if (hasError || exercises.length === 0) {
                    return;
                }
                
                try {
                    const workouts = JSON.parse(localStorage.getItem(`${currentUser.username}_workouts`) || []);
                    workouts.push({ 
                        date: new Date(date).toISOString(), 
                        type, 
                        exercises 
                    });
                    
                    localStorage.setItem(`${currentUser.username}_workouts`, JSON.stringify(workouts));
                    
                    loadWorkoutHistory();
                    loadDashboardData();
                    initCharts();
                    
                    document.getElementById('exercises-container').innerHTML = `
                        <div class="exercise">
                            <div class="form-group">
                                <label for="exercise-name">Exercício</label>
                                <input type="text" id="exercise-name" placeholder="Ex: Supino Reto" required>
                            </div>
                            <div id="sets-container">
                                <div class="exercise-set">
                                    <input type="number" placeholder="Série" class="set-number" value="1" readonly>
                                    <input type="number" placeholder="Peso (kg)" class="set-weight" required>
                                    <input type="number" placeholder="Repetições" class="set-reps" required>
                                    <span class="remove-set">❌</span>
                                </div>
                            </div>
                            <span class="add-set">+ Adicionar Série</span>
                        </div>
                    `;
                    
                    alert('Treino salvo com sucesso!');
                } catch (error) {
                    console.error('Erro ao salvar treino:', error);
                    alert('Ocorreu um erro ao salvar o treino. Verifique o console para mais detalhes.');
                }
            });
            
    
            document.getElementById('save-weight').addEventListener('click', function() {
                saveWeightData(
                    document.getElementById('weight-date').value,
                    document.getElementById('body-weight').value,
                    document.getElementById('body-fat').value
                );
            });
            
           
            document.getElementById('save-weight-2').addEventListener('click', function() {
                saveWeightData(
                    document.getElementById('weight-date-2').value,
                    document.getElementById('body-weight-2').value,
                    document.getElementById('body-fat-2').value,
                    document.getElementById('body-muscle').value
                );
            });
            
            
            function saveWeightData(date, weight, bodyFat, bodyMuscle = null) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                if (!currentUser) {
                    alert('Usuário não autenticado. Faça login novamente.');
                    return;
                }
    
                if (!date || !weight) {
                    alert('Por favor, preencha a data e o peso corretamente.');
                    return;
                }
                
                
                const weightValue = parseFloat(weight);
                if (isNaN(weightValue)) {
                    alert('Por favor, insira um valor numérico válido para o peso.');
                    return;
                }
                
                const weightData = {
                    date: new Date(date).toISOString(), 
                    weight: weightValue,
                    bodyFat: bodyFat ? parseFloat(bodyFat) : null,
                    muscle: bodyMuscle ? parseFloat(bodyMuscle) : null
                };
                
                let weightHistory = JSON.parse(localStorage.getItem(`${currentUser.username}_weightHistory`) || '[]');
                
               
                const existingIndex = weightHistory.findIndex(entry => 
                    new Date(entry.date).toDateString() === new Date(date).toDateString()
                );
                
                if (existingIndex >= 0) {
                    
                    weightHistory[existingIndex] = weightData;
                } else {
                    
                    weightHistory.push(weightData);
                }
                
                
                weightHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                localStorage.setItem(`${currentUser.username}_weightHistory`, JSON.stringify(weightHistory));
                
             
                loadDashboardData();
                initCharts();
                
                alert('Peso registrado com sucesso!');
            }
        }
    });