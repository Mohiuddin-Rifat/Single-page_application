'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page navigation practise before implementing

// This will work fine but its not ideal

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log('Link');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//ideal work for smooth scrolling

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//197 skicky navigation (Intersecting View)

const navHeight = nav.getBoundingClientRect().height;
const stikyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(stikyNav, {
  root: null,
  threshold: 0.1,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

//198 Slow slide show scrolling

const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observerSec) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observerSec.unobserve(entry.target);
};

const observerSec = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  observerSec.observe(section);
  // section.classList.add('section--hidden');
});

//199 lazy Loading Image

const imgTargets = document.querySelectorAll('img[data-src]');

const imgLoad = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const objImg = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0.15,
  rootMargin: '-200px',
});

imgTargets.forEach(img => objImg.observe(img));

//Building Slider Component
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
let maxSlide = slides.length;

// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';

const slideView = function (sld) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - sld)}%)`)
  );
};

slideView(0);
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  slideView(curSlide);
  activeDOts(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  slideView(curSlide);
  activeDOts(curSlide);
};

btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
  // if (e.key === 'ArrowRight') nextSlide();
  // if (e.key === 'ArrowLeft') prevSlide();
});

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    slideView(slide);
    activeDOts(slide);
  }
});

const activeDOts = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activeDOts(0);
// 196 stiky navigation(Low performance)

// const initialcoords = section1.getBoundingClientRect();
// console.log(initialcoords);

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//193 Dom traversing
// const h1 = document.querySelector('h1');
// console.log(h1);

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'Blue';
// h1.lastElementChild.style.color = 'black';

// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// [...h1.parentElement.children].forEach(function (e) {
//   if (e !== h1) {
//     e.style.transform = 'scale(0.5)';
//   }
// });
// 186 practise
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
// console.log(document.querySelectorAll('.header'));
// const allSection = document.querySelectorAll('.section');
// console.log(allSection);

// const messageCookie = document.createElement('div');
// messageCookie.classList.add('.cookie-message');
// messageCookie.innerHTML = `Here is Your cookie for the first experiment with DOM.<button>Click Here </button>`;
// header.append(messageCookie);
// // header.append(messageCookie);
// header.prepend(messageCookie.cloneNode(true));
// // messageCookie.innerHTML = 'Rifat';
// console.log(messageCookie.textContent);

// const messageCoo = document.createElement('Div');
// messageCoo.classList.add('.cookie-message');
// messageCoo.innerHTML =
//   'Here is My cookie Message. <button class="btn btn--close-cookie">GOT IT</button>';
// header.prepend(messageCoo);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     messageCoo.remove();
//   });

// messageCoo.style.background = '#999999';
// messageCoo.style.fontSize = '30px';
// messageCoo.style.border = '2px solid #567482';
// messageCoo.style.borderRadius = '20px';
// messageCoo.style.width = '80%';

// console.log(messageCoo.style.border);
// console.log(messageCoo.style.color);

// .cookie-message {
//   display: flex;
//   align-items: center;
//   justify-content: space-evenly;
//   width: 100%;
//   background-color: white;
//   color: #bbb;
//   font-size: 1.5rem;
//   font-weight: 400;
// }

// console.log(
//   Number.parseFloat(getComputedStyle(messageCoo).height, 10) + 100 + 'px'
// );

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// logo.alt = 'rifat';
// console.log(logo.alt);
// logo.setAttribute('company', 'Syngenta Bangladesh Limited');
// console.log(logo.getAttribute('company'));
// console.log(logo.company);
// console.log(logo.dataset.versionNumber);
