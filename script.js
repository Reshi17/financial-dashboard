   // Application Data and State
        const appData = {
            user: {
                name: "Alex Johnson",
                email: "alex.johnson@example.com",
                profileImage: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0ea5e9&color=fff",
                currency: "$",
                monthlyIncomeGoal: 3500,
                monthlySavingsGoal: 800,
                yearlySavingsGoal: 10000
            },
            financials: {
                totalBalance: 4850.75,
                balanceChange: 12.5,
                monthlyIncome: 3200,
                incomeChange: 5.2,
                monthlyExpenses: 1845.50,
                expensesChange: -8.3,
                savings: 1355.25,
                savingsChange: 15.7
            },
            transactions: [
                { id: 1, name: "Grocery Store", amount: -68.50, type: "expense", category: "food", date: "2023-04-10" },
                { id: 2, name: "Netflix Subscription", amount: -15.99, type: "expense", category: "bills", date: "2023-04-09" },
                { id: 3, name: "Gas Station", amount: -42.30, type: "expense", category: "travel", date: "2023-04-08" },
                { id: 4, name: "Freelance Payment", amount: 350.00, type: "income", category: "misc", date: "2023-04-07" },
                { id: 5, name: "Online Shopping", amount: -89.99, type: "expense", category: "shopping", date: "2023-04-06" },
                { id: 6, name: "Restaurant Dinner", amount: -56.80, type: "expense", category: "food", date: "2023-04-05" },
                { id: 7, name: "Salary Deposit", amount: 2500.00, type: "income", category: "income", date: "2023-04-01" },
                { id: 8, name: "Electricity Bill", amount: -85.50, type: "expense", category: "bills", date: "2023-03-31" }
            ],
            budgets: {
                food: { budget: 600, spent: 450 },
                travel: { budget: 500, spent: 200 },
                shopping: { budget: 500, spent: 300 },
                bills: { budget: 500, spent: 450 },
                misc: { budget: 300, spent: 100 }
            },
            expenseDistribution: {
                food: 30,
                travel: 20,
                shopping: 25,
                bills: 15,
                misc: 10
            },
            nextTransactionId: 9
        };

        // DOM Elements
        const elements = {
            // User interface
            userDisplayName: document.getElementById('userDisplayName'),
            profileImage: document.getElementById('profileImage'),
            profilePreview: document.getElementById('profilePreview'),
            
            // Financial cards
            totalBalance: document.getElementById('totalBalance'),
            balanceChange: document.getElementById('balanceChange'),
            monthlyIncome: document.getElementById('monthlyIncome'),
            incomeChange: document.getElementById('incomeChange'),
            monthlyExpenses: document.getElementById('monthlyExpenses'),
            expensesChange: document.getElementById('expensesChange'),
            savingsAmount: document.getElementById('savingsAmount'),
            savingsChange: document.getElementById('savingsChange'),
            
            // Modals
            transactionModal: document.getElementById('transactionModal'),
            settingsModal: document.getElementById('settingsModal'),
            editCardModal: document.getElementById('editCardModal'),
            editBudgetsModal: document.getElementById('editBudgetsModal'),
            
            // Forms
            transactionForm: document.getElementById('transactionForm'),
            profileForm: document.getElementById('profileForm'),
            financialForm: document.getElementById('financialForm'),
            preferencesForm: document.getElementById('preferencesForm'),
            editCardForm: document.getElementById('editCardForm'),
            editBudgetsForm: document.getElementById('editBudgetsForm'),
            
            // Buttons
            addTransactionBtn: document.getElementById('addTransactionBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            uploadImageBtn: document.getElementById('uploadImageBtn'),
            editBudgetsBtn: document.getElementById('editBudgetsBtn'),
            viewAllTransactions: document.getElementById('viewAllTransactions'),
            
            // Transaction form elements
            transactionId: document.getElementById('transactionId'),
            transactionModalTitle: document.getElementById('transactionModalTitle'),
            transactionSubmitBtn: document.getElementById('transactionSubmitBtn'),
            
            // Tables and containers
            transactionsBody: document.getElementById('transactionsBody'),
            budgetsContainer: document.getElementById('budgetsContainer'),
            chartLegend: document.getElementById('chartLegend'),
            
            // Current year for footer
            currentYear: document.getElementById('currentYear')
        };

        // Chart instance
        let expenseChart;

        // Initialize the application
        function initApp() {
            // Set current year in footer
            elements.currentYear.textContent = new Date().getFullYear();
            
            // Load data from localStorage if available
            loadFromLocalStorage();
            
            // Initialize user interface
            updateUserInterface();
            renderTransactions();
            renderBudgets();
            initializeChart();
            setupEventListeners();
            
            // Set today's date as default in transaction form
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        }

        // Load data from localStorage
        function loadFromLocalStorage() {
            const savedData = localStorage.getItem('smartFinanceDashboardData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                Object.assign(appData, parsedData);
            }
        }

        // Save data to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('smartFinanceDashboardData', JSON.stringify(appData));
        }

        // Update user interface with current data
        function updateUserInterface() {
            // Update user info
            elements.userDisplayName.textContent = appData.user.name;
            elements.profileImage.src = appData.user.profileImage;
            elements.profilePreview.src = appData.user.profileImage;
            
            // Update financial cards
            const currency = appData.user.currency;
            elements.totalBalance.textContent = `${currency}${appData.financials.totalBalance.toFixed(2)}`;
            elements.balanceChange.textContent = `${appData.financials.balanceChange}%`;
            
            elements.monthlyIncome.textContent = `${currency}${appData.financials.monthlyIncome.toFixed(2)}`;
            elements.incomeChange.textContent = `${appData.financials.incomeChange}%`;
            
            elements.monthlyExpenses.textContent = `${currency}${appData.financials.monthlyExpenses.toFixed(2)}`;
            elements.expensesChange.textContent = `${Math.abs(appData.financials.expensesChange)}%`;
            
            elements.savingsAmount.textContent = `${currency}${appData.financials.savings.toFixed(2)}`;
            elements.savingsChange.textContent = `${appData.financials.savingsChange}%`;
            
            // Update profile form
            document.getElementById('userName').value = appData.user.name;
            document.getElementById('userEmail').value = appData.user.email;
            document.getElementById('userCurrency').value = appData.user.currency;
            
            // Update financial goals form
            document.getElementById('monthlyIncomeGoal').value = appData.user.monthlyIncomeGoal;
            document.getElementById('monthlySavingsGoal').value = appData.user.monthlySavingsGoal;
            document.getElementById('yearlySavingsGoal').value = appData.user.yearlySavingsGoal;
            
            // Update edit budgets form
            document.getElementById('foodBudget').value = appData.budgets.food.budget;
            document.getElementById('travelBudget').value = appData.budgets.travel.budget;
            document.getElementById('shoppingBudget').value = appData.budgets.shopping.budget;
            document.getElementById('billsBudget').value = appData.budgets.bills.budget;
            document.getElementById('miscBudget').value = appData.budgets.misc.budget;
        }

        // Render transactions table
        function renderTransactions() {
            elements.transactionsBody.innerHTML = '';
            
            // Sort transactions by date (newest first)
            const sortedTransactions = [...appData.transactions].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            // Show only the 6 most recent transactions
            const transactionsToShow = sortedTransactions.slice(0, 6);
            
            transactionsToShow.forEach(transaction => {
                const row = document.createElement('tr');
                
                // Format date
                const dateObj = new Date(transaction.date);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                // Determine amount class
                const amountClass = transaction.amount < 0 ? 'negative' : 'positive';
                const amountSign = transaction.amount < 0 ? '-' : '+';
                const amountDisplay = `${amountSign}${appData.user.currency}${Math.abs(transaction.amount).toFixed(2)}`;
                
                // Determine category badge
                let categoryClass = 'misc-badge';
                let categoryText = 'Misc';
                
                if (transaction.category === 'food') {
                    categoryClass = 'food-badge';
                    categoryText = 'Food';
                } else if (transaction.category === 'travel') {
                    categoryClass = 'travel-badge';
                    categoryText = 'Travel';
                } else if (transaction.category === 'shopping') {
                    categoryClass = 'shopping-badge';
                    categoryText = 'Shopping';
                } else if (transaction.category === 'bills') {
                    categoryClass = 'bills-badge';
                    categoryText = 'Bills';
                } else if (transaction.type === 'income') {
                    categoryClass = 'income-badge';
                    categoryText = 'Income';
                }
                
                row.innerHTML = `
                    <td>${transaction.name}</td>
                    <td class="${amountClass}">${amountDisplay}</td>
                    <td><span class="category-badge ${categoryClass}">${categoryText}</span></td>
                    <td>${formattedDate}</td>
                    <td>
                        <div class="transaction-actions">
                            <button class="action-btn edit-btn" data-id="${transaction.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" data-id="${transaction.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                elements.transactionsBody.appendChild(row);
            });
            
            // Add event listeners to edit/delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const transactionId = parseInt(e.currentTarget.getAttribute('data-id'));
                    editTransaction(transactionId);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const transactionId = parseInt(e.currentTarget.getAttribute('data-id'));
                    deleteTransaction(transactionId);
                });
            });
        }

        // Render budgets
        function renderBudgets() {
            elements.budgetsContainer.innerHTML = '';
            
            const categories = [
                { key: 'food', name: 'Food & Dining', colorClass: 'food-progress' },
                { key: 'travel', name: 'Travel & Transport', colorClass: 'travel-progress' },
                { key: 'shopping', name: 'Shopping', colorClass: 'shopping-progress' },
                { key: 'bills', name: 'Bills & Utilities', colorClass: 'bills-progress' },
                { key: 'misc', name: 'Miscellaneous', colorClass: 'misc-progress' }
            ];
            
            categories.forEach(category => {
                const budget = appData.budgets[category.key];
                const percentage = (budget.spent / budget.budget) * 100;
                
                const budgetItem = document.createElement('div');
                budgetItem.className = 'budget-item';
                budgetItem.innerHTML = `
                    <div class="budget-item-header">
                        <span class="budget-category">${category.name}</span>
                        <span class="budget-amount">${appData.user.currency}${budget.spent.toFixed(2)} / ${appData.user.currency}${budget.budget.toFixed(2)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${category.colorClass}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-status">${percentage.toFixed(1)}% of budget used</div>
                `;
                
                elements.budgetsContainer.appendChild(budgetItem);
            });
        }

        // Initialize expense chart
        function initializeChart() {
            const ctx = document.getElementById('expenseChart').getContext('2d');
            
            // Destroy existing chart if it exists
            if (expenseChart) {
                expenseChart.destroy();
            }
            
            const colors = {
                food: '#fbbf24',
                travel: '#60a5fa',
                shopping: '#f472b6',
                bills: '#34d399',
                misc: '#a78bfa'
            };
            
            // Prepare chart data
            const labels = ['Food', 'Travel', 'Shopping', 'Bills', 'Misc'];
            const data = [
                appData.expenseDistribution.food,
                appData.expenseDistribution.travel,
                appData.expenseDistribution.shopping,
                appData.expenseDistribution.bills,
                appData.expenseDistribution.misc
            ];
            const backgroundColors = [
                colors.food,
                colors.travel,
                colors.shopping,
                colors.bills,
                colors.misc
            ];
            
            expenseChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 0,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed}%`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
            
            // Update legend
            updateChartLegend();
        }

        // Update chart legend
        function updateChartLegend() {
            elements.chartLegend.innerHTML = '';
            
            const categories = [
                { key: 'food', name: 'Food', percentage: appData.expenseDistribution.food, color: '#fbbf24' },
                { key: 'travel', name: 'Travel', percentage: appData.expenseDistribution.travel, color: '#60a5fa' },
                { key: 'shopping', name: 'Shopping', percentage: appData.expenseDistribution.shopping, color: '#f472b6' },
                { key: 'bills', name: 'Bills', percentage: appData.expenseDistribution.bills, color: '#34d399' },
                { key: 'misc', name: 'Misc', percentage: appData.expenseDistribution.misc, color: '#a78bfa' }
            ];
            
            categories.forEach(category => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.innerHTML = `
                    <div class="legend-color" style="background-color: ${category.color};"></div>
                    <span>${category.name} - ${category.percentage}%</span>
                `;
                elements.chartLegend.appendChild(legendItem);
            });
        }

        // Calculate expense distribution from transactions
        function calculateExpenseDistribution() {
            // Reset distribution
            const distribution = {
                food: 0,
                travel: 0,
                shopping: 0,
                bills: 0,
                misc: 0
            };
            
            // Filter only expense transactions
            const expenseTransactions = appData.transactions.filter(t => t.type === 'expense');
            
            if (expenseTransactions.length === 0) return;
            
            // Calculate total expenses
            const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
            
            if (totalExpenses === 0) return;
            
            // Calculate percentage for each category
            expenseTransactions.forEach(transaction => {
                if (distribution.hasOwnProperty(transaction.category)) {
                    distribution[transaction.category] += Math.abs(transaction.amount);
                }
            });
            
            // Convert to percentages
            for (const category in distribution) {
                distribution[category] = Math.round((distribution[category] / totalExpenses) * 100);
            }
            
            // Update app data
            appData.expenseDistribution = distribution;
            
            // Update chart
            initializeChart();
        }

        // Add a new transaction
        function addTransaction(transactionData) {
            const newTransaction = {
                id: appData.nextTransactionId++,
                ...transactionData
            };
            
            appData.transactions.push(newTransaction);
            
            // Update financials based on transaction type
            if (newTransaction.type === 'income') {
                appData.financials.totalBalance += newTransaction.amount;
                appData.financials.monthlyIncome += newTransaction.amount;
            } else {
                appData.financials.totalBalance -= Math.abs(newTransaction.amount);
                appData.financials.monthlyExpenses += Math.abs(newTransaction.amount);
            }
            
            // Update savings
            appData.financials.savings = appData.financials.monthlyIncome - appData.financials.monthlyExpenses;
            
            // Update spent amount in budget if it's an expense
            if (newTransaction.type === 'expense' && appData.budgets[newTransaction.category]) {
                appData.budgets[newTransaction.category].spent += Math.abs(newTransaction.amount);
            }
            
            // Recalculate expense distribution
            calculateExpenseDistribution();
            
            // Update UI and save data
            updateUserInterface();
            renderTransactions();
            renderBudgets();
            saveToLocalStorage();
        }

        // Edit an existing transaction
        function editTransaction(transactionId) {
            const transaction = appData.transactions.find(t => t.id === transactionId);
            if (!transaction) return;
            
            // Store the old amount for updating financials
            const oldAmount = transaction.amount;
            const oldCategory = transaction.category;
            const oldType = transaction.type;
            
            // Populate form with transaction data
            elements.transactionId.value = transaction.id;
            elements.transactionModalTitle.textContent = 'Edit Transaction';
            elements.transactionSubmitBtn.textContent = 'Update Transaction';
            document.getElementById('transactionName').value = transaction.name;
            document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionDate').value = transaction.date;
            
            // Show modal
            elements.transactionModal.classList.add('active');
        }

        // Delete a transaction
        function deleteTransaction(transactionId) {
            if (!confirm('Are you sure you want to delete this transaction?')) return;
            
            const transactionIndex = appData.transactions.findIndex(t => t.id === transactionId);
            if (transactionIndex === -1) return;
            
            const transaction = appData.transactions[transactionIndex];
            
            // Update financials based on transaction type
            if (transaction.type === 'income') {
                appData.financials.totalBalance -= transaction.amount;
                appData.financials.monthlyIncome -= transaction.amount;
            } else {
                appData.financials.totalBalance += Math.abs(transaction.amount);
                appData.financials.monthlyExpenses -= Math.abs(transaction.amount);
            }
            
            // Update savings
            appData.financials.savings = appData.financials.monthlyIncome - appData.financials.monthlyExpenses;
            
            // Update spent amount in budget if it was an expense
            if (transaction.type === 'expense' && appData.budgets[transaction.category]) {
                appData.budgets[transaction.category].spent -= Math.abs(transaction.amount);
                if (appData.budgets[transaction.category].spent < 0) {
                    appData.budgets[transaction.category].spent = 0;
                }
            }
            
            // Remove transaction from array
            appData.transactions.splice(transactionIndex, 1);
            
            // Recalculate expense distribution
            calculateExpenseDistribution();
            
            // Update UI and save data
            updateUserInterface();
            renderTransactions();
            renderBudgets();
            saveToLocalStorage();
        }

        // Update a financial card value
        function updateFinancialCard(cardType, value, change) {
            if (cardType === 'balance') {
                appData.financials.totalBalance = parseFloat(value);
                appData.financials.balanceChange = parseFloat(change);
            } else if (cardType === 'income') {
                appData.financials.monthlyIncome = parseFloat(value);
                appData.financials.incomeChange = parseFloat(change);
            } else if (cardType === 'expenses') {
                appData.financials.monthlyExpenses = parseFloat(value);
                appData.financials.expensesChange = parseFloat(change);
            } else if (cardType === 'savings') {
                appData.financials.savings = parseFloat(value);
                appData.financials.savingsChange = parseFloat(change);
            }
            
            // Update UI and save data
            updateUserInterface();
            saveToLocalStorage();
        }

        // Update budgets
        function updateBudgets(foodBudget, travelBudget, shoppingBudget, billsBudget, miscBudget) {
            appData.budgets.food.budget = parseFloat(foodBudget);
            appData.budgets.travel.budget = parseFloat(travelBudget);
            appData.budgets.shopping.budget = parseFloat(shoppingBudget);
            appData.budgets.bills.budget = parseFloat(billsBudget);
            appData.budgets.misc.budget = parseFloat(miscBudget);
            
            // Update UI and save data
            renderBudgets();
            saveToLocalStorage();
        }

        // Setup event listeners
        function setupEventListeners() {
            // Add transaction button
            elements.addTransactionBtn.addEventListener('click', () => {
                elements.transactionId.value = '';
                elements.transactionModalTitle.textContent = 'Add New Transaction';
                elements.transactionSubmitBtn.textContent = 'Add Transaction';
                elements.transactionForm.reset();
                document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
                elements.transactionModal.classList.add('active');
            });
            
            // Settings button
            elements.settingsBtn.addEventListener('click', () => {
                elements.settingsModal.classList.add('active');
            });
            
            // Profile image upload
            elements.uploadImageBtn.addEventListener('click', () => {
                document.getElementById('profileImageInput').click();
            });
            
            document.getElementById('profileImageInput').addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        appData.user.profileImage = e.target.result;
                        elements.profileImage.src = e.target.result;
                        elements.profilePreview.src = e.target.result;
                        saveToLocalStorage();
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
            
            // Edit financial cards
            document.querySelectorAll('.edit-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cardType = e.currentTarget.getAttribute('data-edit');
                    const cardTitle = cardType.charAt(0).toUpperCase() + cardType.slice(1);
                    
                    document.getElementById('editCardTitle').textContent = `Edit ${cardTitle}`;
                    document.getElementById('editCardType').value = cardType;
                    
                    // Set current values in form
                    let currentValue = 0;
                    let currentChange = 0;
                    
                    if (cardType === 'balance') {
                        currentValue = appData.financials.totalBalance;
                        currentChange = appData.financials.balanceChange;
                    } else if (cardType === 'income') {
                        currentValue = appData.financials.monthlyIncome;
                        currentChange = appData.financials.incomeChange;
                    } else if (cardType === 'expenses') {
                        currentValue = appData.financials.monthlyExpenses;
                        currentChange = appData.financials.expensesChange;
                    } else if (cardType === 'savings') {
                        currentValue = appData.financials.savings;
                        currentChange = appData.financials.savingsChange;
                    }
                    
                    document.getElementById('editCardValue').value = currentValue;
                    document.getElementById('editCardChange').value = currentChange;
                    
                    elements.editCardModal.classList.add('active');
                });
            });
            
            // Edit budgets button
            elements.editBudgetsBtn.addEventListener('click', () => {
                elements.editBudgetsModal.classList.add('active');
            });
            
            // View all transactions button
            elements.viewAllTransactions.addEventListener('click', () => {
                alert('In a full application, this would show a paginated list of all transactions. For now, you can add, edit, and delete transactions.');
            });
            
            // Tab switching in settings modal
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and content
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    const tabId = tab.getAttribute('data-tab');
                    document.getElementById(`${tabId}Tab`).classList.add('active');
                });
            });
            
            // Form submissions
            elements.transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const transactionId = elements.transactionId.value;
                const name = document.getElementById('transactionName').value;
                const amount = parseFloat(document.getElementById('transactionAmount').value);
                const type = document.getElementById('transactionType').value;
                const category = document.getElementById('transactionCategory').value;
                const date = document.getElementById('transactionDate').value;
                
                const transactionData = {
                    name,
                    amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
                    type,
                    category,
                    date
                };
                
                if (transactionId) {
                    // Editing existing transaction
                    const index = appData.transactions.findIndex(t => t.id === parseInt(transactionId));
                    if (index !== -1) {
                        // Store old values for updating financials
                        const oldTransaction = appData.transactions[index];
                        const oldAmount = oldTransaction.amount;
                        const oldCategory = oldTransaction.category;
                        const oldType = oldTransaction.type;
                        
                        // Update transaction
                        appData.transactions[index] = {
                            ...oldTransaction,
                            ...transactionData,
                            id: parseInt(transactionId)
                        };
                        
                        // Update financials
                        if (oldType === 'income') {
                            appData.financials.totalBalance -= oldAmount;
                            appData.financials.monthlyIncome -= oldAmount;
                        } else {
                            appData.financials.totalBalance += Math.abs(oldAmount);
                            appData.financials.monthlyExpenses -= Math.abs(oldAmount);
                        }
                        
                        // Update budget for old category if it was an expense
                        if (oldType === 'expense' && appData.budgets[oldCategory]) {
                            appData.budgets[oldCategory].spent -= Math.abs(oldAmount);
                            if (appData.budgets[oldCategory].spent < 0) {
                                appData.budgets[oldCategory].spent = 0;
                            }
                        }
                    }
                }
                
                // Add or update financials based on new transaction
                if (type === 'income') {
                    appData.financials.totalBalance += transactionData.amount;
                    appData.financials.monthlyIncome += transactionData.amount;
                } else {
                    appData.financials.totalBalance -= Math.abs(transactionData.amount);
                    appData.financials.monthlyExpenses += Math.abs(transactionData.amount);
                    
                    // Update budget for new category
                    if (appData.budgets[category]) {
                        appData.budgets[category].spent += Math.abs(transactionData.amount);
                    }
                }
                
                // Update savings
                appData.financials.savings = appData.financials.monthlyIncome - appData.financials.monthlyExpenses;
                
                if (!transactionId) {
                    // Add new transaction
                    addTransaction(transactionData);
                } else {
                    // Recalculate expense distribution and update UI
                    calculateExpenseDistribution();
                    updateUserInterface();
                    renderTransactions();
                    renderBudgets();
                    saveToLocalStorage();
                }
                
                // Close modal
                elements.transactionModal.classList.remove('active');
            });
            
            elements.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                appData.user.name = document.getElementById('userName').value;
                appData.user.email = document.getElementById('userEmail').value;
                appData.user.currency = document.getElementById('userCurrency').value;
                
                updateUserInterface();
                saveToLocalStorage();
                alert('Profile updated successfully!');
            });
            
            elements.financialForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                appData.user.monthlyIncomeGoal = parseFloat(document.getElementById('monthlyIncomeGoal').value) || 0;
                appData.user.monthlySavingsGoal = parseFloat(document.getElementById('monthlySavingsGoal').value) || 0;
                appData.user.yearlySavingsGoal = parseFloat(document.getElementById('yearlySavingsGoal').value) || 0;
                
                saveToLocalStorage();
                alert('Financial goals updated successfully!');
            });
            
            elements.editCardForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const cardType = document.getElementById('editCardType').value;
                const value = parseFloat(document.getElementById('editCardValue').value);
                const change = parseFloat(document.getElementById('editCardChange').value);
                
                updateFinancialCard(cardType, value, change);
                elements.editCardModal.classList.remove('active');
            });
            
            elements.editBudgetsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const foodBudget = parseFloat(document.getElementById('foodBudget').value);
                const travelBudget = parseFloat(document.getElementById('travelBudget').value);
                const shoppingBudget = parseFloat(document.getElementById('shoppingBudget').value);
                const billsBudget = parseFloat(document.getElementById('billsBudget').value);
                const miscBudget = parseFloat(document.getElementById('miscBudget').value);
                
                updateBudgets(foodBudget, travelBudget, shoppingBudget, billsBudget, miscBudget);
                elements.editBudgetsModal.classList.remove('active');
            });
            
            // Close modal buttons
            document.getElementById('closeTransactionModalBtn').addEventListener('click', () => {
                elements.transactionModal.classList.remove('active');
            });
            
            document.getElementById('closeSettingsModalBtn').addEventListener('click', () => {
                elements.settingsModal.classList.remove('active');
            });
            
            document.getElementById('closeEditCardModalBtn').addEventListener('click', () => {
                elements.editCardModal.classList.remove('active');
            });
            
            document.getElementById('closeEditBudgetsModalBtn').addEventListener('click', () => {
                elements.editBudgetsModal.classList.remove('active');
            });
            
            // Close modals when clicking outside
            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        overlay.classList.remove('active');
                    }
                });
            });
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', initApp);