document.addEventListener('DOMContentLoaded', function() {
    // Display Current Date and Update Copyright Year in Footer
    function updateFooterDateAndCopyright() {
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Format options for the date
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const formattedDate = now.toLocaleDateString('en-US', options);
        
        // Create date element
        const dateElement = document.createElement('p');
        dateElement.className = 'current-date';
        dateElement.textContent = formattedDate;
        
        // Update copyright year
        const copyright = document.querySelector('.copyright');
        if (copyright) {
            copyright.textContent = `© ${currentYear} Unstoppable You Fitness. All rights reserved.`;
        }
        
        // Add the date to the footer before the copyright
        const footerContent = document.querySelector('.footer-content');
        
        if (footerContent && copyright) {
            footerContent.insertBefore(dateElement, copyright);
        }
    }
    
    // Call the function to update date and copyright
    updateFooterDateAndCopyright();
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = '#000';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            navbar.style.padding = '20px 0';
        }
    });
    
    // Tab functionality for calculators
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Unit System Toggle
    const unitRadios = document.querySelectorAll('input[name="unit-system"]');
    const weightLabels = document.querySelectorAll('.unit-label-weight');
    const heightLabels = document.querySelectorAll('.unit-label-height');
    
    // Set initial unit labels
    updateUnitLabels('metric');
    
    unitRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const unitSystem = this.value;
            updateUnitLabels(unitSystem);
            
            // Clear previous results when changing units
            document.getElementById('bmi-result').innerHTML = '';
            document.getElementById('calorie-result').innerHTML = '';
        });
    });
    
    function updateUnitLabels(unitSystem) {
        if (unitSystem === 'metric') {
            weightLabels.forEach(label => label.textContent = 'kg');
            heightLabels.forEach(label => label.textContent = 'cm');
        } else {
            weightLabels.forEach(label => label.textContent = 'lb');
            heightLabels.forEach(label => label.textContent = 'in');
        }
    }
    
    // Get current unit system
    function getCurrentUnitSystem() {
        const checkedRadio = document.querySelector('input[name="unit-system"]:checked');
        return checkedRadio ? checkedRadio.value : 'metric';
    }
    
    // Convert values based on unit system
    function convertToMetric(weight, height) {
        const unitSystem = getCurrentUnitSystem();
        
        if (unitSystem === 'imperial') {
            // Convert pounds to kg
            weight = weight * 0.453592;
            // Convert inches to cm
            height = height * 2.54;
        }
        
        return { weight, height };
    }
    
    // BMI Calculator
    const bmiForm = document.getElementById('bmi-form');
    const bmiResult = document.getElementById('bmi-result');
    
    if (bmiForm) {
        bmiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let weight = parseFloat(document.getElementById('bmi-weight').value);
            let height = parseFloat(document.getElementById('bmi-height').value);
            
            if (weight > 0 && height > 0) {
                // Convert to metric if needed
                const metricValues = convertToMetric(weight, height);
                weight = metricValues.weight;
                height = metricValues.height / 100; // Convert cm to m
                
                const bmi = weight / (height * height);
                let category = '';
                let color = '';
                
                if (bmi < 18.5) {
                    category = 'Underweight';
                    color = '#3498db';
                } else if (bmi >= 18.5 && bmi < 25) {
                    category = 'Normal weight';
                    color = '#2ecc71';
                } else if (bmi >= 25 && bmi < 30) {
                    category = 'Overweight';
                    color = '#f39c12';
                } else {
                    category = 'Obese';
                    color = '#e74c3c';
                }
                
                bmiResult.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 2rem; font-weight: 700; color: ${color};">${bmi.toFixed(1)}</div>
                        <div style="font-size: 1.2rem; margin-top: 10px;">${category}</div>
                        <div style="margin-top: 15px; font-size: 0.9rem; color: #666;">
                            <p>Underweight: Less than 18.5</p>
                            <p>Normal weight: 18.5 - 24.9</p>
                            <p>Overweight: 25 - 29.9</p>
                            <p>Obese: 30 or greater</p>
                        </div>
                    </div>
                `;
            } else {
                bmiResult.innerHTML = '<p style="color: red;">Please enter valid values</p>';
            }
        });
    }
    
    // Calorie Calculator
    const calorieForm = document.getElementById('calorie-form');
    const calorieResult = document.getElementById('calorie-result');
    
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('calorie-age').value);
            const gender = document.getElementById('calorie-gender').value;
            let weight = parseFloat(document.getElementById('calorie-weight').value);
            let height = parseFloat(document.getElementById('calorie-height').value);
            const activity = parseFloat(document.getElementById('calorie-activity').value);
            
            if (age > 0 && weight > 0 && height > 0 && gender && activity) {
                // Convert to metric if needed
                const metricValues = convertToMetric(weight, height);
                weight = metricValues.weight;
                height = metricValues.height;
                
                let bmr = 0;
                
                if (gender === 'male') {
                    // Mifflin-St Jeor Equation for men
                    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
                } else {
                    // Mifflin-St Jeor Equation for women
                    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
                }
                
                const maintenance = Math.round(bmr * activity);
                const mildLoss = Math.round(maintenance - 250);
                const loss = Math.round(maintenance - 500);
                const extremeLoss = Math.round(maintenance - 1000);
                
                calorieResult.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 15px;">Your Daily Calorie Needs</div>
                        <div class="calorie-results">
                            <div>
                                <strong>Maintenance:</strong> ${maintenance} calories
                                <span class="description">To maintain your current weight</span>
                            </div>
                            <div>
                                <strong>Mild Weight Loss:</strong> ${mildLoss} calories
                                <span class="description">To lose ~0.25kg per week</span>
                            </div>
                            <div>
                                <strong>Weight Loss:</strong> ${loss} calories
                                <span class="description">To lose ~0.5kg per week</span>
                            </div>
                            <div>
                                <strong>Extreme Weight Loss:</strong> ${extremeLoss} calories
                                <span class="description">To lose ~1kg per week</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                calorieResult.innerHTML = '<p style="color: red;">Please fill in all fields</p>';
            }
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send the form data to a server
            // For this demo, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});