//import { greetUser } from '$utils/greet';
import 'overlayscrollbars/overlayscrollbars.css';

import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
//import './styles/fonts.css';
//import './styles/normalize.css';
//import './styles/ohoho-framework.css';
//import './styles/ohoho-defaults.css';
/* import './styles/style.css';  */
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const imagesLoaded = require('imagesloaded');
//import imagesLoaded from 'imagesloaded';
import MouseFollower from 'mouse-follower';
import { OverlayScrollbars } from 'overlayscrollbars';

MouseFollower.registerGSAP(gsap);

/************************************************************************
  OLD CODE TO REWRITE TO MODULES
  ************************************************************************/

gsap.registerPlugin(ScrollTrigger /*,  DrawSVGPlugin */);
gsap.config({ nullTargetWarn: false });

let lenis;
//let swiper;
let cursor;

/*
================================================================================
PRELOADER
================================================================================
*/

const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);
const selectID = (id: string) => document.getElementById(id);

const loader = select('.loader');
const loaderInner = select('.loader .inner');
const progressBar = select('.loader .progress');
const loaderMask = select('.loader__mask');

/*
================================================================================
IMAGES LOADED
================================================================================
*/

function init() {
  // show loader on page load
  gsap.set(loader, { autoAlpha: 1 });

  // scale loader down
  gsap.set(loaderInner, {
    scaleY: 0.025,
    transformOrigin: 'bottom',
  });

  // make a tween that scales the loader
  const progressTween = gsap.to(progressBar, {
    paused: true,
    scaleX: 0,
    ease: 'none',
    autoAlpha: 0,
    transformOrigin: 'right',
  });

  // setup variables
  let loadedImageCount = 0,
    imageCount;
  const container = select('#main');

  // setup Images loaded
  const imgLoad = imagesLoaded(container);
  imageCount = imgLoad.images.length;

  // set the initial progress to 0
  updateProgress(0);

  // triggered after each item is loaded
  imgLoad.on('progress', function () {
    // increase the number of loaded images
    loadedImageCount++;
    // update progress
    updateProgress(loadedImageCount);
  });

  // update the progress of our progressBar tween
  function updateProgress(value) {
    // tween progress bar tween to the right value
    gsap.to(progressTween, {
      progress: value / imageCount,
      duration: 0.3,
      ease: 'power1.out',
    });
  }

  // do whatever you want when all images are loaded
  imgLoad.on('done', function (instance) {
    // we will simply init our loader animation onComplete
    gsap.set(progressBar, {
      autoAlpha: 0,
      onComplete: initPageTransitions,
    });
  });
}

init();

/*
================================================================================
BARBA PAGE TRANSITION IN
================================================================================
*/
function pageTransitionIn({ container }) {
  /*   // timeline to stretch the loader over the whole screen
  const tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'power3.out' } });
  tl.to(container, { autoAlpha: 0, y: 10 }, 0);
  return tl; */
  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: 'power1.inOut',
    },
  });
  tl.set(loaderInner, { autoAlpha: 0 })
    .fromTo(loader, { yPercent: -100 }, { yPercent: 0 })
    .fromTo(loaderMask, { yPercent: 80 }, { yPercent: 0 }, 0);
  //  .to(container, { y: 150 }, 0);
  return tl;
}

/*
================================================================================
BARBA PAGE TRANSITION OUT
================================================================================
*/
function pageTransitionOut({ container }) {
  /*   // timeline to move loader away down
  const tl = gsap.timeline({
    defaults: { duration: 0.4, ease: 'power3.inOut' },
    // OVDJE SE INICIRA PONOVO SAV JS CONTENT / AKO ZATREBA
    onComplete: () => initContent(),
  });
  tl.from(container, { autoAlpha: 0, y: 10 }, 0);
  return tl; */

  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: 'power1.inOut',
    },
    onComplete: () => initContent(),
  });
  tl.to(loader, { yPercent: 100 }).to(loaderMask, { yPercent: -80 }, 0);
  // .from(container, { y: -150 }, 0);
  return tl;
}

/*
================================================================================
♥️ BARBA GLOBAL HOOKS + PREFETCH + INIT + VIEWS + TRANSITIONS
================================================================================
*/
function initPageTransitions() {
  // do something before the transition starts
  barba.hooks.before(() => {
    select('html').classList.add('is-transitioning');
    lenis.stop();
  });
  // do something after the transition finishes
  barba.hooks.after(() => {
    select('html').classList.remove('is-transitioning');
    lenis.start();
  });

  // scroll to the top of the page
  barba.hooks.beforeEnter(() => {
    if (typeof lenis !== 'undefined' && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo('#scrolltotop', { immediate: true });
    }
    // window.scrollTo(0, 0);
  });

  barba.hooks.beforeLeave(() => {
    // kill lenis
    lenis.destroy();

    // kill scrolltrigger
    if (ScrollTrigger.getAll().length > 0) {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    }
  });

  barba.hooks.afterEnter((data) => {
    // autoplay videos
    /*   const vids = document.querySelectorAll('video');
      vids.forEach((vid) => {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.then((_) => { }).catch((error) => { });
        }
      });
  
      if (document.querySelector('.mf-cursor')) {
        cursor.destroy();
      }
  
      // kill scrolltrigger again
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500); */
  });

  barba.hooks.beforeLeave((data) => {
    // active menu item
    /*   if (data.next.url.path) {
        const activeClass = 'current-menu-item';
        const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
  
        navItems.forEach((navItem) => {
          navItem.classList.remove(activeClass);
        });
  
        const clickedNavItem = event.target.closest('.nav-item, .mobile-nav-item');
  
        if (clickedNavItem) {
          clickedNavItem.classList.add(activeClass);
        }
      } */
  });

  barba.hooks.before((data) => {
    //  updateMenu(data.trigger.href);
  });

  /*
================================================================================
BARBA PREFETCH
================================================================================
*/
  barba.use(barbaPrefetch);

  /*
================================================================================
BARBA INIT 
================================================================================
*/

  barba.init({
    debug: true,
    prefetch: true,
    preventRunning: true,

    /*
================================================================================
BARBA VIEWS
================================================================================
*/
    views: [
      {
        namespace: 'home',
        beforeEnter(data) {
          //  mailProtect();
          cubertoCursor();
        },
      },
      {
        namespace: 'about',
        beforeEnter() {
          //   mailProtect();
          cubertoCursor();
        },
      },
      {
        namespace: 'category',
        beforeEnter() {
          //    mailProtect();
          cubertoCursor();
        },
      },
      {
        namespace: 'accessories',
        beforeEnter() {
          //  mailProtect();
          cubertoCursor();
        },
      },
      {
        namespace: 'gazebos',
        beforeEnter(data) {
          //   mailProtect();
          cubertoCursor();
        },
      },
      {
        namespace: 'terms',
        beforeEnter(data) {
          cubertoCursor();
          //   mailProtect();
        },
      },
      {
        namespace: 'contact',
        beforeEnter(data) {
          //  mailProtect();
          contactCheckbox();
          cubertoCursor();
        },
      },
    ],

    /*
    ================================================================================
    BARBA TRANSITIONS
    ================================================================================
    */

    transitions: [
      {
        once({ next }) {
          // do something once on the initial page load
          initLoader();
          //  introAnimation();
          //  updateMenu(window.location.href);
          fullScreenNavComplete();
          mailProtect();
          cubertoCursor();
          // startStopVideo();
        },

        async leave({ current }) {
          // animate loading screen in
          await pageTransitionIn(current);
        },
        enter({ next }) {
          // animate loading screen away
          pageTransitionOut(next);
        },
      },
      {
        /*
      ================================================================================
      TRANSITION FROM PAGE TO PAGE - HOME -> GALLERY
      ================================================================================
      */
        sync: true,
        // Transition for going from home to fashion namespace
        from: { namespace: ['home', 'gallery'] },
        to: { namespace: ['gallery', 'home'] },

        leave(data) {
          return gsap.fromTo(
            data.current.container,
            { yPercent: 0 },
            { yPercent: -10, scale: 1, ease: 'power2.inOut', duration: 0.6, opacity: 0.6 }
          );
        },

        enter(data) {
          //  const transitionData = data;
          data.next.container.classList.add('fixed');
          return gsap.fromTo(
            data.next.container,
            {
              yPercent: 110,
              top: '100%',
              left: 0,
              width: '100%',
              height: '100%',
              position: 'fixed',
            },
            {
              yPercent: 0,
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              ease: 'power2.inOut',
              duration: 0.6,
              onComplete: () => {
                window.scrollTo(0, 0);
                data.next.container.classList.remove('fixed');
              },
            }
          );
        },

        beforeEnter(data) {
          initLoader();
        },
      },

      /*
        ================================================================================
        GALLERY / TEXT -> HOME
        ================================================================================
        */
      {
        sync: true,
        // Transition for going from home to fashion namespace
        from: { namespace: ['text'] },
        to: { namespace: ['home'] },

        leave(data) {
          //  data.next.container.style.zIndex = 10000000;

          return gsap.fromTo(
            data.current.container,
            { yPercent: 0 },
            {
              yPercent: 100,
              ease: 'power2.inOut',
              duration: 0.8,
              onComplete: () => {
                // Reset the z-index of the current container
                //   data.next.container.style.zIndex = "";
              },
            }
          );
        },

        enter(data) {
          // const transitionData = data;
          data.next.container.classList.add('fixed');
          return gsap.fromTo(
            data.next.container,
            { yPercent: 100, scale: 1 },
            {
              yPercent: 0,
              scale: 1,
              ease: 'power2.inOut',
              duration: 1,
              onComplete: () => {
                window.scrollTo(0, 0);
                data.next.container.classList.remove('fixed');
              },
            }
          );
        },

        beforeLeave(data) {
          const tl = gsap.timeline();
          tl.to(
            '.about_title > span',
            {
              stagger: 0.02,
              duration: 0.25,
              ease: 'expo',
              yPercent: 102,
            },
            0
          );
        },
      },
      {
        /*
        ================================================================================
        FASHION -> HOME
        ================================================================================
        */
        sync: true,
        // Transition for going from home to fashion namespace
        from: { namespace: ['fashion'] },
        to: { namespace: ['home'] },
        leave(data) {
          return gsap.fromTo(
            data.current.container,
            { yPercent: 0 },
            {
              yPercent: 100,
              ease: 'power2.inOut',
              duration: 0.8,
            }
          );
        },
        enter(data) {
          //  const transitionData = data;
          data.next.container.classList.add('fixed');
          return gsap.fromTo(
            data.next.container,
            { yPercent: -100, scale: 0.7 },
            {
              yPercent: 0,
              scale: 1,
              ease: 'power2.inOut',
              duration: 0.8,
              onComplete: () => {
                window.scrollTo(0, 0);
                data.next.container.classList.remove('fixed');

                /* resetWebflow(transitionData); */
              },
            }
          );
        },
      },
    ],

    /*
================================================================================
PREVENT / CLICKS DURRING TRANSITION AND CURRENT LINK 
================================================================================
*/
    prevent: ({ event, href }): boolean => {
      if (event.type === 'click') {
        // prevent the user to reload the page if the location is the same
        if (href === window.location.href) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
        if (barba.transitions.isRunning) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
      return false;
    },
  });

  /*
================================================================================
UPDATE ACTIVE CLASS ON THE MENU - BASED ON THE GIVEN URL
================================================================================
*/

  /* function init() {
    initLoader();
  } */
}

/*
================================================================================
PRELOADER --> vodi na --> INIT CONTENT
================================================================================
*/
function initLoader() {
  const tlLoaderIn = gsap.timeline({
    id: 'tlLoaderIn',
    defaults: {
      duration: 1.1,
      ease: 'power2.out',
    },
    onComplete: () => initContent(),
  });

  const image = select('.loader__image img');
  const mask = select('.loader__image--mask');
  const line1 = select('.loader__title--mask:nth-child(1) span');
  const line2 = select('.loader__title--mask:nth-child(2) span');
  const lines = selectAll('.loader__title--mask');
  const loaderContent = select('.loader__content');

  tlLoaderIn
    .set(loaderContent, { autoAlpha: 1 })
    .to(loaderInner, {
      scaleY: 1,
      transformOrigin: 'bottom',
      ease: 'power1.inOut',
    })
    .addLabel('revealImage')
    .from(mask, { yPercent: 100 }, 'revealImage-=0.6')
    .from(image, { yPercent: -80 }, 'revealImage-=0.6')
    .from([line1, line2], { yPercent: 100, stagger: 0.1 }, 'revealImage-=0.4');

  const tlLoaderOut = gsap.timeline({
    id: 'tlLoaderOut',
    defaults: {
      duration: 1.2,
      ease: 'power2.inOut',
    },
    delay: 1,
  });

  tlLoaderOut
    .to(lines, { yPercent: -500, stagger: 0.2 }, 0)
    .to([loader, loaderContent], { yPercent: -100 }, 0.2);
  // .from('#main', { y: 150 }, 0.2);

  const tlLoader = gsap.timeline();
  tlLoader.add(tlLoaderIn).add(tlLoaderOut);
}

/*
================================================================================
INIT CONTENT --> vodi na --> INIT SCROLL
================================================================================
*/
function initContent() {
  select('body').classList.remove('is-loading');
  initScroll();
}

/*
================================================================================
MAIN JS + LENIS + GLOBAL
================================================================================
*/

function initScroll() {
  /* LENIS SMOOTH SCROLL*/

  lenis = new Lenis({
    duration: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical', // vertical, horizontal
    gestureOrientation: 'vertical', // vertical, horizontal, both
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    //normalizeWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  /*
================================================================================
LENIS SCROLL TO TOP
================================================================================
*/

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (this: HTMLElement, e) {
      e.preventDefault();
      lenis.scrollTo(this.getAttribute('href'));
    });
  });

  /*
================================================================================
ON WINDOW RESIZE - REFRESH SCROLLTRIGGER
================================================================================
*/

  window.addEventListener('resize', function () {
    ScrollTrigger.refresh();
  });

  /*
================================================================================
RELOAD SITE WHEN RESIZE AND CHANGE FROM DESKTOP TO MOBILE AND VICE VERSA
================================================================================
*/

  window.addEventListener('resize', function () {
    const desktop = window.matchMedia('screen and (min-width: 1200px)');
    const mobile = window.matchMedia('screen and (max-width: 1200px)');

    const desktopListener = function (e: MediaQueryListEvent) {
      if (e.matches) {
        location.reload();
      }
    };

    const mobileListener = function (e: MediaQueryListEvent) {
      if (e.matches) {
        location.reload();
      }
    };

    desktop.addEventListener('change', desktopListener);
    mobile.addEventListener('change', mobileListener);
  });

  /************************************************************************
  OVERLAY SCROLLBAR
  ************************************************************************/

  if (window.innerWidth > 1024) {
    OverlayScrollbars(document.body, {
      scrollbars: {
        theme: 'os-theme-custom',
        visibility: 'visible',
        dragScroll: true,
        clickScroll: false,
        pointers: ['mouse', 'touch', 'pen'],
      },
      /*   nativeScrollbarsOverlaid: {
        initialize: false,
      }, */
    });
  }
}

/*
================================================================================
MY FUNCTIONS
================================================================================
*/

/*
================================================================================
CUBERTO MOUSE
================================================================================
*/
function cubertoCursor() {
  if (window.innerWidth > 1024) {
    cursor = new MouseFollower({
      el: null,
      container: document.body,
      className: 'mf-cursor',
      innerClassName: 'mf-cursor-inner',
      textClassName: 'mf-cursor-text',
      mediaClassName: 'mf-cursor-media',
      mediaBoxClassName: 'mf-cursor-media-box',
      iconSvgClassName: 'mf-svgsprite',
      iconSvgSrc: '/images/spritex.svg',
      dataAttr: 'cursor',
      hiddenState: '-hidden',
      textState: '-text',
      iconState: '-icon',
      activeState: '-active',
      mediaState: '-media',
      stateDetection: {
        '-pointer': 'a,button',
        '-hidden': 'my-image',
      },
      visible: true,
      visibleOnState: false,
      speed: 0.55,
      ease: 'expo.out',
      overwrite: true,
      skewing: 0,
      skewingText: 2,
      skewingIcon: 2,
      skewingMedia: 2,
      skewingDelta: 0.001,
      skewingDeltaMax: 0.15,
      stickDelta: 0.15,
      showTimeout: 20,
      hideOnLeave: true,
      hideTimeout: 300,
      //  hideMediaTimeout: 300,
    });
  }
}

/*
================================================================================
MAIL PROTECT
================================================================================
*/

function mailProtect() {
  /*  !(function (e) {
    if ('object' === typeof exports && 'undefined' !== typeof module) module.exports = e();
    else if ('function' === typeof define && define.amd) define([], e);
    else {
      ('undefined' !== typeof window
        ? window
        : 'undefined' !== typeof global
          ? global
          : 'undefined' !== typeof self
            ? self
            : this
      ).DataProtect = e();
    }
  })(function () {
    return (function e(t, n, o) {
      function r(s, f) {
        if (!n[s]) {
          if (!t[s]) {
            const u = 'function' === typeof require && require;
            if (!f && u) return u(s, !0);
            if (i) return i(s, !0);
            const l = new Error("Cannot find module '" + s + "'");
            throw ((l.code = 'MODULE_NOT_FOUND'), l);
          }
          const d = (n[s] = { exports: {} });
          t[s][0].call(
            d.exports,
            function (e) {
              return r(t[s][1][e] || e);
            },
            d,
            d.exports,
            e,
            t,
            n,
            o
          );
        }
        return n[s].exports;
      }
      for (var i = 'function' === typeof require && require, s = 0; s < o.length; s++) r(o[s]);
      return r;
    })(
      {
        1: [
          function (e, t, n) {
            const o = {
              defaultConfig: { key: 'secret key', x: 5, delimiter: '-', suppressConsole: !1 },
              _options: function (e) {
                e = e || {};
                const t = this;
                return (
                  Object.keys(this.defaultConfig).forEach(function (n) {
                    void 0 === e[n] && (e[n] = JSON.parse(JSON.stringify(t.defaultConfig[n])));
                  }),
                  (e.key = '' == e.key ? this.defaultConfig.key : e.key),
                  e.key != this.defaultConfig.key ||
                  e.suppressConsole ||
                  console.warn(
                    'It is highly recommended that you set a key and do not use the default key'
                  ),
                  e.key.length < 8 &&
                  !e.suppressConsole &&
                  console.warn('It is recommended to use a key with length longer than 8'),
                  (e.key = e.key.toString()),
                  '' == e.delimiter &&
                  ((e.delimiter = '-'),
                    e.suppressConsole ||
                    console.warn('Delimiter should not be "", changed to "-"')),
                  e.x % 1 == 1 || e.suppressConsole,
                  (e.x = Math.round(e.x)),
                  e
                );
              },
              encodeData: function (e, t) {
                return (
                  (t = this._options(t)),
                  (e = (function (e, t) {
                    k = 0;
                    for (let n = 0; n < e.length; n++)
                      n > t.key.length - 1 && k > t.key.length - 1 && (k = 0),
                        (e[n] = e[n].toString().charCodeAt() + t.key.charCodeAt(k) * t.x),
                        k++;
                    return e;
                  })(e.toString().split(''), t)).join(t.delimiter)
                );
              },
              decodeData: function (e, t) {
                return (
                  (t = this._options(t)),
                  (e = (function (e, t) {
                    k = 0;
                    for (let n = 0; n < e.length; n++)
                      n > t.key.length - 1 && k > t.key.length - 1 && (k = 0),
                        (e[n] = String.fromCharCode(e[n] - t.key.charCodeAt(k) * t.x)),
                        k++;
                    return e;
                  })(e.split(t.delimiter), t)).join('')
                );
              },
            };
            t.exports = { DataProtect: o };
          },
          {},
        ],
      },
      {},
      [1]
    )(1);
  });

  DataProtect = DataProtect.DataProtect;

  const options = {
    key: 'u2138SJAl', // just a random string
    x: 5,
  };

  const emailPlaceholders = document.querySelectorAll('.email-placeholder');
  emailPlaceholders.forEach((emailPlaceholder) => {
    const encodedEmail = emailPlaceholder.getAttribute('data-decode-email');
    const decryptedEmail = DataProtect.decodeData(encodedEmail, options);
    const emailLink = document.createElement('a');
    emailLink.href = 'mailto:' + decryptedEmail;
    emailLink.innerText = decryptedEmail;
    emailLink.classList.add('email-link'); // Add CSS class
    emailPlaceholder.appendChild(emailLink);
    emailPlaceholder.removeAttribute('data-decode-email');
    emailPlaceholder.classList.remove('email-placeholder');
  }); */
  // use this to encode the email and then paste this value into the attribute data-decode-email
  //console.log(DataProtect.encodeData('info@kupole.hr', options))
  // and then obviously delete this line when your done
}

/*
================================================================================
CHECKBOX FIX
================================================================================
*/

function contactCheckbox() {
  const customCheckboxes = document.querySelectorAll(
    '.w-checkbox-input--inputType-custom.checkbox, .w-checkbox-input--inputType-custom.form-checkbox-icon, .w-checkbox-input--inputType-custom.fs-cc-prefs2_checkbox'
  );

  function toggleCheckboxState(checkbox) {
    const input = checkbox.nextElementSibling;
    if (input && input.tagName === 'INPUT' && input.type === 'checkbox') {
      checkbox.classList.toggle('w--redirected-checked', input.checked);
    }
  }

  customCheckboxes.forEach(function (checkbox) {
    const input = checkbox.nextElementSibling;
    if (input && input.tagName === 'INPUT' && input.type === 'checkbox') {
      input.addEventListener('change', function () {
        toggleCheckboxState(checkbox);
      });

      // Ensure the checkbox state matches the input state on page load
      toggleCheckboxState(checkbox);
    }
  });
}

/*
================================================================================
FULLSCREEN LOCOMOTIVE NAVIGATION
================================================================================
*/
function fullScreenNavComplete() {
  const openmenu = selectID('openmenu');
  const closemenu = selectID('closemenu');

  /* ***************************************************************************
Menu - Underline & Superscript
***************************************************************************** */

  const underlineLinks = document.querySelectorAll<HTMLElement>('.fs-main-nav_wrapper');

  underlineLinks.forEach((link) => {
    const underline = link.querySelector('.underline') as HTMLElement;
    const superscript = link.querySelector('.superscript') as Element;
    //  const mainItem = link.querySelector('.fs-main-item') as Element;

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      underline,
      { width: '0%', left: '0%' },
      { width: '100%', duration: 0.3, ease: 'power1.out' }
    )
      .from(
        superscript,
        {
          color: '#000000',
          y: '20px',
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '<'
      )
      //  .to(mainItem, { color: '#777777', ease: 'power1.out' }, '<')
      .add('midway')
      .fromTo(
        underline,
        { width: '100%', left: '0%' },
        { width: '0%', left: '100%', duration: 0.3, ease: 'power1.in', immediateRender: false }
      )
      .to(
        superscript,
        {
          color: '#000000',
          y: '20px',
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power1.out',
        },
        '<'
      );
    //  .to(mainItem, { color: '#000000', ease: 'power1.out', overwrite: 'auto' }, '<');

    link['tl'] = tl;

    let timeoutId: number | null = null;

    link.addEventListener('mouseenter', () => {
      timeoutId = setTimeout(() => {
        link['tl'].tweenFromTo(0, 'midway');
      }, 200); // Add a delay of 300 milliseconds
    });

    link.addEventListener('mouseleave', () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      link['tl'].play();
    });
  });

  /* ***************************************************************************
Menu Icon - Hover
***************************************************************************** */

  const hambyHover = selectID('menuhover');
  const hambyLine2 = selectAll('.hambyline2');
  const hambyLine3 = selectAll('.hambyline3');

  if (hambyHover) {
    hambyHover.addEventListener('mouseover', () => {
      const hambyTimeline = gsap.timeline({ defaults: { autoAlpha: 1 } });
      hambyTimeline
        .to(hambyLine2, { width: '100%', duration: 0.1 })
        .to(hambyLine3, { width: '100%' }, '<-0.05');
    });

    hambyHover.addEventListener('mouseout', () => {
      const hambyTimeline = gsap.timeline({ defaults: { autoAlpha: 1 } });
      hambyTimeline
        .to(hambyLine2, { width: '80%', duration: 0.1 })
        .to(hambyLine3, { width: '55%' }, '<-0.05');
    });
  }

  /* ***************************************************************************
Open Menu
***************************************************************************** */

  const menuWrapper = select('.fs-menu_wrapper');
  const wBack = select('.wback');
  const bgImage = select('.bgimage');
  const marqueeItem = select('.fs-menu_marquee');
  const mainItem = selectAll('.fs-main-item');
  const subItem = selectAll('.fs-sub-item');
  const langItem = selectAll('.fs-menu_language_nav');

  const openMenuAnimation = gsap.timeline({ defaults: { autoAlpha: 1, ease: 'power1.out' } });
  openMenuAnimation.paused(true);
  openMenuAnimation
    .to(openmenu, { autoAlpha: 0, rotate: 360, scale: 0.1 })
    .from(closemenu, { autoAlpha: 0, rotate: -360, scale: 0.1 }, '<')

    .fromTo(
      menuWrapper,
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' },
      { clipPath: 'polygon(0 0, 60% 0, 10% 100%, 0% 100%)' },
      '<'
    )
    .fromTo(
      menuWrapper,
      { clipPath: 'polygon(0 0, 60% 0, 10% 100%, 0% 100%)' },
      { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
      '<0.3'
    )

    //.to('.background', { backgroundColor: 'var(--light' }, '<')
    .from(wBack, { autoAlpha: 0, opacity: 0 }, '<')
    .from(bgImage, { autoAlpha: 0, scale: 1.2, duration: 1, ease: 'power1.out' }, '<')
    .from(
      mainItem,
      { x: -40, stagger: 0.05, autoAlpha: 0, duration: 0.5, ease: 'power1.out' },
      '<0.1'
    )
    .from(subItem, { x: -40, stagger: 0.05, autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, '<')
    .from(langItem, { autoAlpha: 0, x: -40, duration: 1 }, '<')
    .from(
      marqueeItem,
      { autoAlpha: 0, x: 700, y: 500, opacity: 0, duration: 1, ease: 'power1.out' },
      '<'
    );

  /* ***************************************************************************
Close Menu
***************************************************************************** */
  const closeMenuAnimation = gsap.timeline({ defaults: { autoAlpha: 0, ease: 'power1.out' } });
  closeMenuAnimation
    .from(openmenu, { autoAlpha: 0, rotate: 360, scale: 0.1 })
    .to(closemenu, { autoAlpha: 1, rotate: 360, scale: 0.1 }, '<')

    .fromTo(
      menuWrapper,
      { autoAlpha: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
      { duration: 0.5, autoAlpha: 1, clipPath: 'polygon(0 0, 10% 0, 60% 100%, 0% 100%)' },
      '<'
    )
    .fromTo(
      menuWrapper,
      { autoAlpha: 1, clipPath: 'polygon(0 0, 10% 0, 60% 100%, 0% 100%)' },
      { duration: 0.3, autoAlpha: 1, clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)' },
      '-=0.2'
    )
    //  .fromTo('.background', { backgroundColor: '#3f4874' }, { backgroundColor: '#ff0000' }, '<')
    //.fromTo(wBack, { opacity: 1 }, { opacity: 0, duration: 1 }, '<')
    .fromTo(
      bgImage,
      { scale: 1, autoAlpha: 1 },
      { duration: 0.3, scale: 1.1, autoAlpha: 0 },
      '<-0.3'
    )
    .fromTo(
      mainItem,
      { autoAlpha: 1, x: 0 },
      { x: -40, stagger: 0.1, duration: 0.5, autoAlpha: 0 },
      '<'
    )
    .fromTo(
      subItem,
      { autoAlpha: 1, x: 0 },
      { x: -40, stagger: 0.1, duration: 0.5, autoAlpha: 0 },
      '<'
    )
    /*  .fromTo(
      '.fs-menu_language_nav',
      { autoAlpha: 1 },
      { autoAlpha: 0, stagger: 0.1, duration: 0.5 },
      '+=1'
    ) */
    .fromTo(marqueeItem, { autoAlpha: 1 }, { duration: 0.15, autoAlpha: 0 }, '<0.1');

  if (openmenu) {
    openmenu.addEventListener('click', function () {
      openMenuAnimation.restart();
      openMenuAnimation.play();
      lenis.stop();
    });
  }

  if (closemenu) {
    closemenu.addEventListener('click', function () {
      closeMenuAnimation.restart();
      closeMenuAnimation.play();
      lenis.start();
    });
  }

  /* ***************************************************************************
Submenu - Change Color on Hover
***************************************************************************** */

  const hoverColorElements = document.querySelectorAll('.hovercolor');

  hoverColorElements.forEach((hoverColorElement) => {
    const hoverOverlay = hoverColorElement;
    const tl = gsap.timeline({ paused: true });
    tl.to(hoverOverlay, { duration: 0.15, color: '#fb9fa3' });
    hoverColorElement.addEventListener('mouseenter', () => {
      tl.play();
    });
    hoverColorElement.addEventListener('mouseleave', () => {
      tl.reverse();
    });
  });

  /* ***************************************************************************
Hover Animation - Use for various elements
***************************************************************************** */

  const hoverAnimationElements = document.querySelectorAll<HTMLElement>('.collage');

  hoverAnimationElements.forEach((hoverAnimationElement) => {
    const timeline = gsap.timeline({ paused: true });
    const wrapper = hoverAnimationElement.querySelector<HTMLElement>('.collage-wrapper');

    if (wrapper) {
      const t = timeline.to(wrapper, { y: 20, duration: 0.3, ease: 'power1.out' });
      hoverAnimationElement['animation'] = t;

      hoverAnimationElement.addEventListener('mouseenter', function () {
        if (this['animation']) {
          this['animation'].play();
        }
      });

      hoverAnimationElement.addEventListener('mouseleave', function () {
        if (this['animation']) {
          this['animation'].reverse();
        }
      });
    }
  });

  /* ***************************************************************************
Marquee
***************************************************************************** */

  document.querySelectorAll('.fs-menu_marquee').forEach(function (tickerWrapper: Element) {
    const list = tickerWrapper.querySelector('ul.marqueelist');
    const clonedList: HTMLElement | null = list?.cloneNode(true) as HTMLElement | null;
    let listWidth = 10;

    list?.querySelectorAll('li').forEach(function (li) {
      listWidth += li.offsetWidth;
    });

    //const endPos = tickerWrapper.offsetWidth - listWidth;

    if (list) {
      (list as HTMLElement).style.width = listWidth + 'px';
    }

    if (clonedList) {
      (clonedList as HTMLElement).style.width = listWidth + 'px';
      clonedList.classList.add('cloned');
      tickerWrapper.appendChild(clonedList);
    }

    const infinite = gsap.timeline({ repeat: -1, paused: true });
    const time = 10;

    if (list && clonedList) {
      infinite
        .fromTo(
          list,
          { rotation: 0.01, x: 0 },
          { force3D: true, duration: time, x: -listWidth, ease: 'linear' },
          0
        )
        .fromTo(
          clonedList,
          { rotation: 0.01, x: listWidth },
          { force3D: true, duration: time, x: 0, ease: 'linear' },
          0
        )
        .set(list, { force3D: true, rotation: 0.01, x: listWidth })
        .to(
          clonedList,
          { force3D: true, duration: time, rotation: 0.01, x: -listWidth, ease: 'linear' },
          time
        )
        .to(list, { force3D: true, duration: time, rotation: 0.01, x: 0, ease: 'linear' }, time)
        .progress(1)
        .progress(0)
        .play();
    }

    tickerWrapper.addEventListener('mouseenter', function () {
      if (infinite) {
        infinite.pause();
      }
    });

    tickerWrapper.addEventListener('mouseleave', function () {
      if (infinite) {
        infinite.play();
      }
    });
  });
}
