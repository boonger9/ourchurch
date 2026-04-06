document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 초기 로딩 시 스크롤 위치 보정
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    // 2. Mobile Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
             // 요청하신 sub-menu 슬라이드 효과 처럼 단순히 보이게 우선 처리
            mobileMenu.style.display = 'flex';
        } else {
            mobileMenu.style.display = 'none';
        }
    });

    // 서브메뉴 링크 클릭 시 모바일 메뉴 닫기
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.style.display = 'none';
        });
    });

    // 3. Scroll Fade-in Animation Observer
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 한 번만 애니메이션 실행
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 부드러운 스크롤 (Anchor Navigation) - 최신 브라우저는 CSS scroll-behavior 지원하지만 
    // 헤더 높이만큼 오프셋을 맞추기 위한 JS fallback 대응
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Cursor Particle Trail (Antigravity style)
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
             width = canvas.width = window.innerWidth;
             height = canvas.height = window.innerHeight;
        });

        let particles = [];
        let mouse = { x: width/2, y: height/2 };

        window.addEventListener('mousemove', (e) => {
             mouse.x = e.clientX;
             mouse.y = e.clientY;
             // Add particles on move
             for(let i=0; i<3; i++) {
                 particles.push({
                     x: mouse.x,
                     y: mouse.y,
                     vx: (Math.random() - 0.5) * 2,
                     vy: (Math.random() - 0.5) * 2,
                     life: 1,
                     color: `hsla(${Math.random() * 60 + 200}, 70%, 50%, 0.8)` // Blue tones
                 });
             }
        });

        function animateParticles() {
             ctx.clearRect(0, 0, width, height);
             for(let i=0; i < particles.length; i++) {
                 let p = particles[i];
                 p.x += p.vx;
                 p.y += p.vy;
                 p.life -= 0.02;
                 
                 ctx.beginPath();
                 ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
                 ctx.fillStyle = p.color;
                 ctx.fill();
             }
             particles = particles.filter(p => p.life > 0);
             requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});
