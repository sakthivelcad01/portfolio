console.log('script.js: Loaded. readyState:', document.readyState);

function init() {
  console.log('script.js: Initializing portfolio functions...');

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Link ScrollTrigger updates to Lenis scroll events
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Background Glows Parallax
  gsap.to('.glow-1', {
    y: 150,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  gsap.to('.glow-2', {
    y: -250,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  // Hero Section Parallax
  gsap.to('.hero-visual', {
    y: 80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-content', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  /* ==========================================================================
     STICKY NAVBAR TRANSITION
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check


  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const menuIcon = mobileToggle.querySelector('.menu-icon');
  const closeIcon = mobileToggle.querySelector('.close-icon');

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    if (isOpen) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Lock scrolling when open
      lenis.stop();
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      document.body.style.overflow = '';
      lenis.start();
    }
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Connect local anchor links to Lenis scrollTo
  const allAnchors = document.querySelectorAll('a[href^="#"]');
  allAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      if (anchor.classList.contains('mobile-toggle') || anchor.id === 'modal-close') return;
      
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        if (navMenu && navMenu.classList.contains('open')) {
          toggleMenu();
        }
        
        lenis.scrollTo(targetElement, {
          offset: -80, // Offset for navbar height
          duration: 1.2
        });
      }
    });
  });


  /* ==========================================================================
     EXPERIENCE COLLAPSIBLE ACCORDIONS
     ========================================================================== */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const isActive = trigger.classList.toggle('active');
      
      if (isActive) {
        // Compute precise inner height of content for smooth slide down
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });


  /* ==========================================================================
     PROJECTS 3D GALAXY (THREE.JS + GSAP)
     ========================================================================== */
  const container = document.getElementById('projects-galaxy-container');
  const canvas = document.getElementById('projects-galaxy-canvas');
  let resetCamera = null;

  if (container && canvas) {
    const scene = new THREE.Scene();

    // Galaxy scroll rotation animation
    const galaxyScroll = { rotationY: 0 };
    gsap.to(galaxyScroll, {
      rotationY: Math.PI * 1.0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 35);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Orbit Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 12;
    controls.maxDistance = 50;
    controls.enablePan = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 100);
    pointLight.position.set(0, 20, 15);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, -10, -15);
    scene.add(dirLight);

    // Starry Galaxy Background
    const starCount = 1500;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = Math.random() * 45 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.35; // Flat disk galaxy

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const r = Math.random();
      if (r < 0.4) {
        colors[i * 3] = 0.45; colors[i * 3 + 1] = 0.45; colors[i * 3 + 2] = 1.0; // soft indigo/blue
      } else if (r < 0.7) {
        colors[i * 3] = 0.8; colors[i * 3 + 1] = 0.35; colors[i * 3 + 2] = 0.85; // soft magenta/violet
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // bright white stars
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Round rect draw helper for canvas textures (maximum cross-browser compatibility)
    const drawRoundRect = (ctx, x, y, width, height, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Tech text sprite generator
    const createTextSprite = (text, strokeColor) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background capsule
      ctx.fillStyle = 'rgba(10, 14, 23, 0.85)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      drawRoundRect(ctx, 8, 8, 240, 48, 24);
      ctx.fill();
      ctx.stroke();

      // Text styling
      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(3.2, 0.8, 1);
      return sprite;
    };

    // Planet builder
    const planets = [];
    const makePlanet = (radius, color, wireframeColor, x, y, z, techList, name, key) => {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      scene.add(group);

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.15,
        metalness: 0.85,
        flatShading: false
      });
      const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
      coreMesh.userData = { key: key };
      group.add(coreMesh);

      // Hologram shell wireframe grid
      const shellGeo = new THREE.SphereGeometry(radius * 1.18, 16, 16);
      const shellMat = new THREE.MeshBasicMaterial({
        color: wireframeColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const shellMesh = new THREE.Mesh(shellGeo, shellMat);
      shellMesh.userData = { key: key };
      group.add(shellMesh);

      // Orbiting tech ring group
      const ringGroup = new THREE.Group();
      group.add(ringGroup);

      // Orbiting tags
      const tagCount = techList.length;
      techList.forEach((tech, i) => {
        const angle = (i / tagCount) * Math.PI * 2;
        const tagSprite = createTextSprite(tech, wireframeColor);
        const ringRadius = radius * 2.3;
        tagSprite.position.x = Math.cos(angle) * ringRadius;
        tagSprite.position.z = Math.sin(angle) * ringRadius;
        tagSprite.position.y = (Math.random() - 0.5) * 0.2;
        ringGroup.add(tagSprite);
      });

      const planetData = {
        group: group,
        mesh: coreMesh,
        shellMesh: shellMesh,
        ringGroup: ringGroup,
        name: name,
        key: key,
        baseY: y,
        floatOffset: Math.random() * Math.PI * 2
      };
      planets.push(planetData);
    };

    // Initialize planets (Rupiece, Arch, Forex, Paper Trading)
    makePlanet(2.4, 0x10b981, 0x34d399, -13, 0, 3, ['Next.js 16', 'FastAPI', 'WebSockets', 'Python'], 'Rupiece', 'rupiece');
    makePlanet(2.1, 0xd1d5db, 0xf3f4f6, -4, 2, -10, ['Next.js', 'Headless CMS', 'Vercel', 'SMTP API'], 'Architectural Portfolio', 'architectural-portfolio');
    makePlanet(2.2, 0xf59e0b, 0xfbbf24, 5, -2, -5, ['ASP.NET MVC', 'C#', 'SQL Server', 'Caching'], 'Real-Time Forex Exchange App', 'real-time-forex-exchange-app');
    makePlanet(2.3, 0x8b5cf6, 0xc084fc, 12, 1, 8, ['React Native', 'Expo', 'Redux', 'WebSockets'], 'Paper Trading Mobile App', 'paper-trading-mobile-app');
    makePlanet(2.0, 0xef4444, 0xf87171, -10, -3, -6, ['.NET Core', 'gRPC', 'Kafka', 'Elastic'], 'Distributed Logs Pipeline', 'distributed-logs-pipeline');
    makePlanet(1.9, 0x06b6d4, 0x22d3ee, 7, 3, 3, ['Python', 'LangChain', 'OpenAI', 'DevOps'], 'AI Code Review Agent', 'ai-code-review-agent');
    makePlanet(2.1, 0xf97316, 0xfb923c, 1, -3, 9, ['React', 'Next.js', 'SQL Server', 'GraphQL'], 'SaaS Inventory Suite', 'saas-inventory-suite');
    makePlanet(1.9, 0xec4899, 0xf472b6, -6, -2, 12, ['Node.js', 'Playwright', 'Redis', 'Docker'], 'Self-Healing Scraper Mesh', 'self-healing-scraper-mesh');

    // Raycasting & mouse events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredPlanet = null;
    let selectedPlanet = null;

    container.addEventListener('mousemove', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    let startX = null, startY = null;
    container.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
    });

    container.addEventListener('click', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (startX !== null && startY !== null) {
        const diffX = Math.abs(e.clientX - startX);
        const diffY = Math.abs(e.clientY - startY);
        if (diffX > 8 || diffY > 8) {
          startX = null;
          startY = null;
          return; // it was a camera drag
        }
      }
      startX = null;
      startY = null;

      if (selectedPlanet) return;

      raycaster.setFromCamera(mouse, camera);
      const targets = [];
      planets.forEach(p => {
        targets.push(p.mesh, p.shellMesh);
      });
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const planetKey = hitMesh.userData.key;
        const planetObj = planets.find(p => p.key === planetKey);
        if (planetObj) {
          zoomToPlanet(planetObj);
        }
      }
    });

    // Zoom camera helper
    const zoomToPlanet = (planetObj) => {
      selectedPlanet = planetObj;
      controls.enabled = false;

      const targetPos = new THREE.Vector3();
      planetObj.group.getWorldPosition(targetPos);

      // Position camera in front of planet
      const destCamPos = targetPos.clone().add(new THREE.Vector3(0, 1.2, 7.2));

      // Update directions text
      const instr = container.querySelector('.galaxy-instructions span');
      if (instr) instr.textContent = `Exploring ${planetObj.name} • Close the detail panel to return`;

      gsap.timeline({
        onComplete: () => {
          openModal(planetObj.key);
        }
      })
      .to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0)
      .to(camera.position, {
        x: destCamPos.x,
        y: destCamPos.y,
        z: destCamPos.z,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0);
    };

    // Camera reset helper
    resetCamera = () => {
      if (!selectedPlanet) return;
      selectedPlanet = null;

      const instr = container.querySelector('.galaxy-instructions span');
      if (instr) instr.textContent = 'Drag to orbit • Scroll to zoom • Click planet to inspect details';

      gsap.timeline({
        onComplete: () => {
          controls.enabled = true;
        }
      })
      .to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0)
      .to(camera.position, {
        x: 0,
        y: 15,
        z: 35,
        duration: 1.5,
        ease: 'power3.inOut'
      }, 0);
    };

    // Responsive sizing
    window.addEventListener('resize', () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Raycast checks
      raycaster.setFromCamera(mouse, camera);
      const targets = [];
      planets.forEach(p => {
        targets.push(p.mesh, p.shellMesh);
      });
      const intersects = raycaster.intersectObjects(targets);

      let activeHover = null;
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const planetKey = hitMesh.userData.key;
        activeHover = planets.find(p => p.key === planetKey);
      }

      if (activeHover) {
        container.style.cursor = 'pointer';
        if (hoveredPlanet !== activeHover) {
          if (hoveredPlanet) {
            gsap.to(hoveredPlanet.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
          }
          hoveredPlanet = activeHover;
          gsap.to(hoveredPlanet.mesh.scale, { x: 1.22, y: 1.22, z: 1.22, duration: 0.3 });
        }
      } else {
        container.style.cursor = selectedPlanet ? 'default' : 'grab';
        if (hoveredPlanet) {
          gsap.to(hoveredPlanet.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
          hoveredPlanet = null;
        }
      }

      // Rotate starfield slowly
      starField.rotation.y += 0.0003;

      // Animate planets and tech rings
      planets.forEach(p => {
        p.mesh.rotation.y += 0.006;
        
        // Spin tech tag rings
        const ringSpeed = (hoveredPlanet === p) ? 0.024 : 0.007;
        p.ringGroup.rotation.y += ringSpeed;

        // Floating hover motion
        const time = Date.now() * 0.0012;
        p.group.position.y = p.baseY + Math.sin(time + p.floatOffset) * 0.2;
      });

      // Rotate the entire galaxy group with scroll position
      scene.rotation.y = galaxyScroll.rotationY;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  }


  /* ==========================================================================
     REVEAL ON SCROLL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-reveal-delay');
        if (delay) {
          setTimeout(() => {
            entry.target.classList.add('active-reveal');
          }, parseInt(delay));
        } else {
          entry.target.classList.add('active-reveal');
        }
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px' // Trigger slightly before element enters view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     LIGHT / DARK THEME TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Get active theme
  const getTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Set active theme
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Initial load
  const currentTheme = getTheme();
  setTheme(currentTheme);

  // Toggle theme click listener
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  });


  /* ==========================================================================
     PROJECT DETAILS MODAL LOGIC
     ========================================================================== */
  const projectsData = {
    'rupiece': {
      title: 'Rupiece',
      image: 'assets/project_rupiece.png?v=1.0.1',
      tags: ['Next.js 16', 'FastAPI', 'WebSockets', 'Python', 'React 19'],
      description: 'Rupiece is a high-performance, real-time proprietary trading and evaluation dashboard. It features an asynchronous simulated order execution engine designed to handle multi-contract calculations and trade executions with sub-100ms updates via WebSockets.',
      challenges: [
        'Designed real-time risk engine with 2-sample drawdown check logic, reducing false liquidation breaches by 95%.',
        'Built automated token renewal scripts using Playwright and Selenium, achieving 100% oauth login uptime.',
        'Created a responsive, offline-ready React PWA terminal utilizing Framer Motion and Recharts.'
      ],
      github: 'https://github.com/sakthivelcad01',
      live: 'https://github.com/sakthivelcad01'
    },
    'architectural-portfolio': {
      title: 'Architectural Portfolio',
      image: 'assets/project_architecture.png?v=1.0.1',
      tags: ['Next.js', 'Headless CMS', 'Vercel', 'Image Pipeline', 'SMTP API'],
      description: 'A premium, search-optimized web platform showcasing a minimalist architectural design portfolio. Features include lazy loading image pipeline integrations, server-side API inquiry validation, and automatic email alert notifications.',
      challenges: [
        'Engineered AVIF/WebP image compression pipelines, achieving a 95+ Lighthouse Performance Score.',
        'Structured dynamic server-side content hooks using a lightweight Headless CMS API connection.',
        'Built modern glassmorphic responsive designs to ensure smooth presentation on 4K, tablet, and mobile.'
      ],
      github: 'https://github.com/sakthivelcad01/Arch',
      live: 'https://github.com/sakthivelcad01/Arch'
    },
    'real-time-forex-exchange-app': {
      title: 'Real-Time Forex Exchange App',
      image: 'assets/project_forex.png?v=1.0.1',
      tags: ['ASP.NET MVC', 'C#', 'REST API', 'SQL Server', 'Caching Layer'],
      description: 'A financial analytical tool built to monitor global currency rates. It utilizes an asynchronous back-end polling service to retrieve pricing metrics and maintains a local memory cache database to serve user queries with minimal latency.',
      challenges: [
        'Built asynchronous rate-scheduling background workers in C# to retrieve and update live currency feeds.',
        'Reduced outer API dependancy requests and network bottlenecks by 80% using memory cache layers.',
        'Designed historical exchange interactive data trend charts utilizing Google Charts.'
      ],
      github: 'https://github.com/sakthivelcad01/forex_exch',
      live: 'https://github.com/sakthivelcad01/forex_exch'
    },
    'paper-trading-mobile-app': {
      title: 'Paper Trading Mobile App',
      image: 'assets/project_paper_trading.png?v=1.0.1',
      tags: ['React Native', 'Expo', 'Redux Toolkit', 'WebSockets', 'iOS & Android'],
      description: 'A virtual stock trading application developed for mobile devices. It connects to live web service feeds to update exchange pricing charts, supporting limit orders, stop-losses, and historical performance statistics logs.',
      challenges: [
        'Developed a unified cross-platform code base using React Native and Expo targeting iOS and Android.',
        'Structured real-time state synchronization using Redux Toolkit to manage mock portfolio balances.',
        'Implemented chart animations running at 60 FPS for fluid viewport scrolling and interaction.'
      ],
      github: 'https://github.com/sakthivelcad01/paper_trading_App',
      live: 'https://github.com/sakthivelcad01/paper_trading_App'
    },
    'distributed-logs-pipeline': {
      title: 'Distributed Logs Pipeline',
      image: 'assets/project_logs_pipeline.png?v=1.0.1',
      tags: ['.NET Core', 'gRPC', 'Kafka', 'Elasticsearch', 'Redis'],
      description: 'A distributed log aggregation and analysis pipeline designed for microservices. It ingests high-velocity metrics and telemetry data asynchronously, processes and filters them, and indexes them into Elasticsearch with sub-second latency.',
      challenges: [
        'Built high-performance C# gRPC service endpoints that process over 15,000 requests per second per node.',
        'Established multi-consumer Kafka partition bindings to guarantee zero log message loss during node failures.',
        'Optimized telemetry queries and index rollups in Elasticsearch, saving 40% on storage retention budgets.'
      ],
      github: 'https://github.com/sakthivelcad01',
      live: 'https://github.com/sakthivelcad01'
    },
    'ai-code-review-agent': {
      title: 'AI Code Review Agent',
      image: 'assets/project_ai_reviewer.png?v=1.0.1',
      tags: ['Python', 'LangChain', 'OpenAI', 'GitHub API', 'Docker'],
      description: 'An AI-augmented DevOps review bot that hooks into repository webhooks. It automatically analyzes code diffs, detects security exploits, identifies architectural violations, and posts contextual inline feedback on pull requests.',
      challenges: [
        'Structured prompt engineering chains using LangChain to enforce coding patterns and prevent LLM hallucinations.',
        'Designed secure sandboxed runtime environments in Docker to safely run dynamic parser and linter tools.',
        'Decreased standard developer code review cycle times by 35% through automated preliminary syntax/security passes.'
      ],
      github: 'https://github.com/sakthivelcad01',
      live: 'https://github.com/sakthivelcad01'
    },
    'saas-inventory-suite': {
      title: 'SaaS Inventory Suite',
      image: 'assets/project_saas_inventory.png?v=1.0.1',
      tags: ['React', 'Next.js', 'SQL Server', 'GraphQL', 'OAuth2'],
      description: 'An enterprise multi-tenant warehouse and inventory management platform. Features include real-time stock level synchronization across multiple branch hubs, customizable PDF generation, and secure RBAC access controls.',
      challenges: [
        'Designed normalized SQL Server database schemas optimized for high-concurrency inventory allocation locks.',
        'Engineered dynamic bulk loading GraphQL resolvers that handle page queries with sub-80ms server response times.',
        'Implemented strict JWT authentication and tenant sub-domain routing layers to guarantee data isolation.'
      ],
      github: 'https://github.com/sakthivelcad01',
      live: 'https://github.com/sakthivelcad01'
    },
    'self-healing-scraper-mesh': {
      title: 'Self-Healing Scraper Mesh',
      image: 'assets/project_scraper_mesh.png?v=1.0.1',
      tags: ['Node.js', 'Playwright', 'Redis', 'Docker', 'Puppeteer'],
      description: 'A resilient web scraping grid system designed to pull large-scale market indices. It dynamically changes proxies, bypasses advanced anti-bot captchas, and self-heals by using AI models to infer selectors when layouts change.',
      challenges: [
        'Built a centralized coordinator in Redis to distribute scrapers across multiple geographic VPS nodes.',
        'Integrated selector inference logic that automatically repairs broken paths, achieving a 99.8% collection success rate.',
        'Designed proxy-rotation algorithms with automatic back-off cooldown lists to minimize IP bans.'
      ],
      github: 'https://github.com/sakthivelcad01',
      live: 'https://github.com/sakthivelcad01'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalDetails = document.getElementById('modal-project-details');

  const openModal = (projectKey) => {
    const data = projectsData[projectKey];
    if (!data) return;

    // Generate tags markup
    const tagsHTML = data.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
    
    // Generate challenges markup
    const challengesHTML = data.challenges.map(li => `<li>${li}</li>`).join('');

    modalDetails.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-wrapper">
          <img src="${data.image}" alt="${data.title} Mockup">
        </div>
        <div class="modal-info">
          <div class="modal-info-header">
            <div class="project-tags">${tagsHTML}</div>
            <h3 class="modal-title">${data.title}</h3>
          </div>
          <div class="modal-info-body">
            <div>
              <h4>Overview</h4>
              <p class="modal-description">${data.description}</p>
            </div>
            <div>
              <h4>Key Deliverables & Challenges</h4>
              <ul class="modal-challenges-list">${challengesHTML}</ul>
            </div>
          </div>
          <div class="modal-info-footer">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              <span>View Code on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock background scroll
    lenis.stop();
  };

  const closeModal = () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
    lenis.start();
    if (resetCamera) resetCamera();
  };

  modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('open')) {
      closeModal();
    }
  });


  /* ==========================================================================
     FLOATING AI CHAT WIDGET
     ========================================================================== */
  const chatWidget = document.getElementById('ai-chat-widget');
  const chatToggle = document.getElementById('chat-toggle');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatUserInput = document.getElementById('chat-user-input');
  const chatQuickReplies = document.getElementById('chat-quick-replies');

  // Assistant pre-configured responses
  const qaDatabase = {
    'skills': 'I specialize in full-stack engineering using **C# (.NET Core)** and **JavaScript/React/Next.js**. I also build asynchronous backends in **Python (FastAPI)** and set up headless testing utilizing **Playwright/Selenium**.',
    'projects': 'My key projects are **Rupiece** (prop-trading monitoring execution engine), **Arch** (an architectural portfolio platforms), a **Forex Rate Monitor**, and a virtual **Paper Trading Mobile Application**.',
    'rupiece': '**Rupiece** is a prop-trading risk management platform featuring an async simulated order execution calculations engine (FastAPI/React). I built risk metrics that reduced false liquidation errors by 95%!',
    'experience': 'I have over **2 years of experience** specializing in .NET backend services, React client SPAs, and automated testing integrations. I also finished a Frontend Internship at Bright Services.',
    'contact': 'You can reach out directly via:<br>• Email: **sakthivels05062@gmail.com**<br>• Phone: **+91 9514605031**<br>• GitHub: [sakthivelcad01](https://github.com/sakthivelcad01)<br>• LinkedIn: [sakthivel05062](https://linkedin.com/in/sakthivel05062)',
    'availability': 'I am currently **available for new opportunities**! I am seeking Full-Stack Developer, .NET Backend Developer, or Frontend React roles (remote, hybrid, or freelance).'
  };

  const quickReplyChips = [
    { text: '🛠️ Core Stack', key: 'skills' },
    { text: '📈 Rupiece Project', key: 'rupiece' },
    { text: '💼 Hire Sakthivel', key: 'availability' },
    { text: '✉️ Contact Details', key: 'contact' }
  ];

  // Helper to add chat bubbles
  const addMessageBubble = (text, sender) => {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // Typing indicator simulator
  const showTypingIndicator = () => {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-typing', 'temp-typing');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const indicators = chatMessages.querySelectorAll('.temp-typing');
    indicators.forEach(ind => ind.remove());
  };

  // Simulated bot answer
  const getAssistantAnswer = (inputVal) => {
    const inputClean = inputVal.toLowerCase();
    
    if (inputClean.includes('skill') || inputClean.includes('stack') || inputClean.includes('language') || inputClean.includes('c#') || inputClean.includes('react')) {
      return qaDatabase.skills;
    } else if (inputClean.includes('rupiece') || inputClean.includes('trading') || inputClean.includes('prop')) {
      return qaDatabase.rupiece;
    } else if (inputClean.includes('project') || inputClean.includes('work') || inputClean.includes('portfolio')) {
      return qaDatabase.projects;
    } else if (inputClean.includes('contact') || inputClean.includes('phone') || inputClean.includes('email') || inputClean.includes('reach')) {
      return qaDatabase.contact;
    } else if (inputClean.includes('hire') || inputClean.includes('open') || inputClean.includes('job') || inputClean.includes('availab')) {
      return qaDatabase.availability;
    } else if (inputClean.includes('experience') || inputClean.includes('intern') || inputClean.includes('bright')) {
      return qaDatabase.experience;
    } else if (inputClean.includes('hello') || inputClean.includes('hi') || inputClean.includes('hey')) {
      return 'Hello! I am Sakthivel\'s assistant. How can I help you learn more about his developer profile today?';
    } else {
      return 'I am not sure I understand that query. You can ask me about my **skills**, my **projects** (like **Rupiece**), my work **experience**, or how to **contact** me!';
    }
  };

  const loadQuickReplies = () => {
    chatQuickReplies.innerHTML = '';
    quickReplyChips.forEach(chip => {
      const chipBtn = document.createElement('button');
      chipBtn.classList.add('chat-chip');
      chipBtn.textContent = chip.text;
      chipBtn.addEventListener('click', () => {
        handleUserMessage(chip.text, chip.key);
      });
      chatQuickReplies.appendChild(chipBtn);
    });
  };

  const handleUserMessage = (userText, databaseKey = null) => {
    // 1. Add user bubble
    addMessageBubble(userText, 'user');
    
    // 2. Typing state
    showTypingIndicator();
    
    // 3. Bot response delay
    setTimeout(() => {
      removeTypingIndicator();
      const responseText = databaseKey ? qaDatabase[databaseKey] : getAssistantAnswer(userText);
      addMessageBubble(responseText, 'bot');
    }, 750);
  };

  // Toggle chat widget
  chatToggle.addEventListener('click', () => {
    const isOpen = chatWidget.classList.toggle('open');
    if (isOpen && chatMessages.children.length === 0) {
      // Welcome message on first load
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessageBubble('Welcome! I am Sakthivel\'s AI Assistant. How can I help you explore his portfolio today?', 'bot');
        loadQuickReplies();
      }, 500);
    }
  });

  // Submit handler
  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatUserInput.value.trim();
    if (!text) return;
    chatUserInput.value = '';
    handleUserMessage(text);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
