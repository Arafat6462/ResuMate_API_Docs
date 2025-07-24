// Custom JavaScript for ResuMate Documentation

document.addEventListener('DOMContentLoaded', function() {
    // Interactive elements will be added here
    console.log('ResuMate Documentation loaded');
    
    // Performance metrics animation
    const performanceMetrics = document.querySelectorAll('.performance-metric');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Animate performance metrics on scroll
    performanceMetrics.forEach((metric, index) => {
        metric.style.opacity = '0';
        metric.style.transform = 'translateY(30px)';
        metric.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(metric);
    });
    
    // Stat cards animation
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Metric cards animation
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });
    
    // Assessment cards animation
    const assessmentCards = document.querySelectorAll('.assessment-card');
    assessmentCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(' + (index % 2 === 0 ? '-30px' : '30px') + ')';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Add click analytics for performance button
    const performanceButton = document.querySelector('.performance-button');
    if (performanceButton) {
        performanceButton.addEventListener('click', function() {
            // Add a subtle success animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
});
