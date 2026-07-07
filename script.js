
        // ─── Loader ───
        window.addEventListener('load', () => {
            document.getElementById('loader').classList.add('hidden');
            initStatsCounter();
            initSkillBars();
        });

        // ─── Theme ───
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        const icon = themeToggle.querySelector('i');

        function setTheme(theme) {
            html.setAttribute('data-theme', theme);
            icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            localStorage.setItem('theme', theme);
        }

        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });

        // ─── Navbar scroll ───
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
            document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
        });

        // ─── Hamburger ───
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });

        // ─── Back to top ───
        document.getElementById('backTop').addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ─── Cursor ───
        const cursor = document.getElementById('cursorDot');
        let cursorX = 0,
            cursorY = 0;
        let mouseX = 0,
            mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, .project-card, .skill-card, .exp-card, .edu-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });

        // ─── Particles ───
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resizeCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) particles.push(new Particle());

        function drawParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update();
                p.draw(); });
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // ─── Typing Effect ───
        const typedText = document.getElementById('typedText');
        const words = ['Python Developer', 'Data Analyst', 'Problem Solver', 'Creative Coder'];
        let wordIndex = 0,
            charIndex = 0,
            isDeleting = false;

        function typeEffect() {
            const current = words[wordIndex];
            if (!isDeleting) {
                typedText.textContent = current.slice(0, charIndex++);
                if (charIndex > current.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
            } else {
                typedText.textContent = current.slice(0, charIndex--);
                if (charIndex < 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    charIndex = 0;
                    setTimeout(typeEffect, 400);
                    return;
                }
            }
            setTimeout(typeEffect, isDeleting ? 40 : 80);
        }
        typeEffect();

        // ─── Stats Counter ───
        function initStatsCounter() {
            const stats = document.querySelectorAll('.stat-item .number');
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                let current = 0;
                const increment = Math.ceil(target / 60);
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const interval = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    current = target;
                                    clearInterval(interval);
                                }
                                stat.textContent = current;
                            }, 30);
                            observer.unobserve(stat);
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(stat);
            });
        }

        // ─── Skill Bars ───
        function initSkillBars() {
            const fills = document.querySelectorAll('.skill-bar .fill');
            fills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            fill.style.width = width + '%';
                            observer.unobserve(fill);
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(fill);
            });
        }

        // ─── Reveal Animations ───
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));

        // ─── Projects Data with separate Demo & Code links ───
        const projects = [{
            id: 1,
            title: 'Live Attendance System Using Face Recognition',
            desc: 'A real-time attendance system was developed using FaceNet and OpenCV to automate attendance tracking. The system detects and recognizes faces from live video and stores records in a database, achieving 94-97% accuracy under normal conditions.',
            tags: ['Python', 'OpenCV', 'Face Recognition', 'Facenet'],
            category: 'web',
            image: 'images/p1.png',
            demoLink: 'https://github.com/avinashkumar059/Live-Attendance-System-Using-Face-Recognition/blob/main/README.md',
            codeLink: 'https://github.com/avinashkumar059/Live-Attendance-System-Using-Face-Recognition.git'
        }, {
            id: 2,
            title: 'Portfolio',
            desc: 'A portfolio is a well-organized collection of an individual’s work, achievements, skills, and experiences that demonstrates their knowledge, abilities, and progress over time. It may include projects, assignments, certificates, reports, designs, or other evidence of accomplishments, depending on its purpose.',
            tags: ['HTML', 'CSS', 'JS'],
            category: 'web',
            image: 'images/p2.png',
            demoLink: '#',
            codeLink: 'https://github.com/avinashkumar059/portfolio'
        }, {
            id: 3,
            title: 'Pizza Hut Sales Analysis',
            desc: 'This Pizza Sales Analysis project focuses on analyzing a pizza restaurant’s sales data using SQL to extract meaningful business insights. It includes a series of SQL queries that calculate key performance metrics such as total orders, total revenue, most popular pizza types and sizes, category-wise sales, hourly order distribution, average daily orders, and revenue trends.',
            tags: ['MySql', 'Solved Problem'],
            category: 'mobile',
            image: 'images/p4.png',
            demoLink: 'https://github.com/avinashkumar059/Pizza_hut/blob/main/Pizza_Sales.pdf',
            codeLink: 'https://github.com/avinashkumar059/Pizza_hut.git'
        }, {
            id: 5,
            title: 'Mithila Flower & Gift House',
            desc: 'Mithila Flower & Gift House Frontend Website Project is designed to provide an engaging and seamless experience for users looking to explore flowers, gifts, and event decorations.',
            tags: ['HTML', 'CSS', 'JS'],
            category: 'web',
            image: 'images/p3.png',
            demoLink: '#',
            codeLink: 'https://github.com/avinashkumar059/cryptovault'
        }];

        const grid = document.getElementById('projectsGrid');
        const filterBtns = document.querySelectorAll('.project-filters button');

        function renderProjects(filter = 'all') {
            const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
            grid.innerHTML = filtered.map(p => `
                        <div class="project-card reveal" style="transition-delay:0.1s;">
                            <div class="thumbnail">
                                <img src="${p.image}" alt="${p.title}" loading="lazy" />
                                <div class="overlay"></div>
                                
                            </div>
                            <div class="body">
                                <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
                                <h3>${p.title}</h3>
                                <p>${p.desc}</p>
                                <div class="links">
                                    <a href="${p.demoLink}" target="_blank" class="link-demo"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                                    <a href="${p.codeLink}" target="_blank" class="link-code"><i class="fab fa-github"></i> Source Code</a>
                                </div>
                            </div>
                        </div>
                    `).join('');
            grid.querySelectorAll('.project-card').forEach(el => revealObserver.observe(el));
        }

        renderProjects();

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProjects(btn.getAttribute('data-filter'));
            });
        });

        // ─── Smooth nav clicks ───
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
