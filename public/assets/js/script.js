const userClient = window.navigator.userAgent;
const isInternetExp = /MSIE|Trident/.test(userClient);

if (isInternetExp) {
  const IEStyle = document.createElement('link');
  IEStyle.rel = 'stylesheet';
  IEStyle.href = './assets/CSS/internetexplorer11.css';
  document.getElementsByTagName('head')[0].appendChild(IEStyle);
}

function openModal() {
  document.getElementById('modal').classList.remove('content-block_disabled');
  document.getElementById('modal').classList.add('modal_on');
  document.getElementById('page').classList.add('page_modal-active');
}
function closeModal() {
  document.getElementById('modal').classList.remove('modal_on');
  document.getElementById('modal').classList.add('content-block_disabled');
  document.getElementById('page').classList.remove('page_modal-active');
}
document
  .getElementById('headerEnterButton')
  .addEventListener('click', openModal);
document
  .getElementById('modalBackground')
  .addEventListener('click', closeModal);

function checkMarkToggle() {
  const checkBox = document.getElementById('checkBox');
  if (checkBox.checked === true) {
    document
      .getElementById('checkMark')
      .classList.remove('content-block_disabled');
  } else {
    document
      .getElementById('checkMark')
      .classList.add('content-block_disabled');
  }
}
document
  .getElementById('checkMarkLabel')
  .addEventListener('click', checkMarkToggle);

function switchToTvs() {
  document
    .getElementById('moviesTab')
    .classList.remove('tabbs__tabbcategory_active');
  document
    .getElementById('channelsTab')
    .classList.add('tabbs__tabbcategory_active');
  document.getElementById('movies').classList.add('content-block_disabled');
  document
    .getElementById('channels')
    .classList.remove('content-block_disabled');
  scrollSizeShrink();
}
function switchToMovies() {
  document
    .getElementById('channelsTab')
    .classList.remove('tabbs__tabbcategory_active');
  document
    .getElementById('moviesTab')
    .classList.add('tabbs__tabbcategory_active');
  document.getElementById('channels').classList.add('content-block_disabled');
  document.getElementById('movies').classList.remove('content-block_disabled');
}
document.getElementById('channelsTab').addEventListener('click', switchToTvs);
document.getElementById('moviesTab').addEventListener('click', switchToMovies);

const passport = 'letter-box';
function getStorageEntries(storage) {
  const passportEntries = [];
  let passportEntrieState = false;
  const regex = new RegExp('^[0-9]+$');
  for (let i = 0; i < Object.keys(storage).length; i += 1) {
    const key = Object.keys(storage)[i];
    const keyPassport = key.split('=')[1];
    const timeStamp = key.split('=')[0];
    if (
      keyPassport === passport &&
      key.split('=')[2] === undefined &&
      regex.test(timeStamp)
    ) {
      passportEntrieState = true;
      const keyPass = Object.keys(storage)[i];
      const valuePass = storage.getItem(Object.keys(storage)[i]);
      passportEntries.push([keyPass, valuePass]);
    }
  }
  return [passportEntries, passportEntrieState];
}

const local = getStorageEntries(localStorage)[1];
const session = getStorageEntries(sessionStorage)[1];
function checkLoginStatus() {
  let loginStatus = false;
  if (local || session) {
    loginStatus = true;
  }
  return loginStatus;
}

function getUserKeyLogin() {
  let userLoginArray = [];
  let userLogin = '';
  let lastEntries = Array;
  if (local / session === Infinity) {
    lastEntries = getStorageEntries(localStorage);
  } else {
    lastEntries = getStorageEntries(sessionStorage);
  }
  userLoginArray = lastEntries[0].sort().pop();
  userLogin = JSON.parse(userLoginArray[1]).login;
  return [userLoginArray[0], userLogin];
}

function showUserName() {
  if (checkLoginStatus()) {
    const login = getUserKeyLogin()[1];
    document.getElementById('loginName').value = login;
    document.getElementById('loginName').title = login;
    document
      .getElementById('accountLogged')
      .classList.remove('content-block_disabled');
    document
      .getElementById('accountLoggedOut')
      .classList.add('content-block_disabled');
  }
}
showUserName();

function editLoginFromPage() {
  const newLogin = document.getElementById('loginName').value;
  document.getElementById('loginName').title =
    document.getElementById('loginName').value;
  const char = '=';
  if (local / session === Infinity) {
    const userValueObj = JSON.parse(localStorage.getItem(getUserKeyLogin()[0]));
    userValueObj.login = newLogin;
    localStorage.setItem(getUserKeyLogin()[0], JSON.stringify(userValueObj));
    document.cookie = passport + char + newLogin;
  } else {
    const userValueObj = JSON.parse(
      sessionStorage.getItem(getUserKeyLogin()[0])
    );
    userValueObj.login = newLogin;
    sessionStorage.setItem(getUserKeyLogin()[0], JSON.stringify(userValueObj));
  }
}

function checkLoginFromPage() {
  const regex = new RegExp('^ *$');
  if (!regex.test(document.getElementById('loginName').value)) {
    editLoginFromPage();
  } else {
    const login = getUserKeyLogin()[1];
    document.getElementById('loginName').value = login;
  }
  document.getElementById('loginName').readOnly = true;
}
document
  .getElementById('loginName')
  .addEventListener('focusout', checkLoginFromPage);

function removeReadOnlyLogin() {
  document.getElementById('loginName').readOnly = false;
}
document
  .getElementById('loginName')
  .addEventListener('mousedown', removeReadOnlyLogin);

function userLoggout() {
  const expireDate = '=;expires=';
  if (local / session === Infinity) {
    localStorage.removeItem(getUserKeyLogin()[0]);
    document.cookie = passport + expireDate + new Date(0).toUTCString();
    window.location.reload();
  } else {
    sessionStorage.removeItem(getUserKeyLogin()[0]);
    window.location.reload();
  }
}
document
  .getElementById('headerQuitButton')
  .addEventListener('click', userLoggout);

function saveLogin() {
  const checkBox = document.getElementById('checkBox');
  const char = '=';
  const expireDate = ';expires=01 Jan 2022 00:00:00 UTC;';
  const key = Date.now() + char + passport;
  const loginObj = {
    login: document.getElementById('login').value,
    password: document.getElementById('password').value,
    passport: 'letter-box',
    time: parseFloat(Date.now()),
  };
  if (checkBox.checked && !checkLoginStatus()) {
    localStorage.setItem(key, JSON.stringify(loginObj));
    document.cookie = passport + char + String(loginObj.login) + expireDate;
  } else if (!checkBox.checked && !checkLoginStatus()) {
    sessionStorage.setItem(key, JSON.stringify(loginObj));
  }
}

function checkEmptyField() {
  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const regex = new RegExp('^ *$');
  if (regex.test(login) || regex.test(password)) {
    console.error('Login/Password cannot be empty');
  } else {
    saveLogin();
  }
}
document
  .getElementById('buttonEnterModal')
  .addEventListener('click', checkEmptyField);

const scrollContainer = document.getElementById('scrollWrapper');
const scrollBar = document.getElementById('scrollBar');
const innerChannels = document.getElementById('innerChannels');

function scrollBarChannels(event) {
  document.getElementById('page').classList.add('select-disabled');
  const clickedX = event.pageY;
  const topX = parseFloat(getComputedStyle(scrollBar).top.split('p')[0]);
  const px = 'px';
  function scrollBarMove(ev) {
    const innerChannelsHeight = innerChannels.getBoundingClientRect().height;
    const scrollContainerHeight =
      scrollContainer.getBoundingClientRect().height;
    const scrollBarHeight = scrollBar.getBoundingClientRect().height;
    const borderRadiusOffset = 4;
    const emptySpaceScrollContainer =
      scrollContainerHeight - scrollBarHeight - borderRadiusOffset;
    const topScrollOffsetX = ev.pageY - clickedX + topX;
    const rateTop =
      (innerChannelsHeight - scrollContainerHeight) / emptySpaceScrollContainer;
    if (topScrollOffsetX > emptySpaceScrollContainer) {
      scrollBar.style.top = emptySpaceScrollContainer + px;
      innerChannels.style.top =
        -(
          (document.getElementById('scrollBar').getBoundingClientRect().top -
            document.getElementById('scrollInner').getBoundingClientRect().top -
            2) *
          rateTop
        ) + px;
    } else if (topScrollOffsetX < 0) {
      scrollBar.style.top = 0 + px;
      innerChannels.style.top =
        -(
          (document.getElementById('scrollBar').getBoundingClientRect().top -
            document.getElementById('scrollInner').getBoundingClientRect().top -
            2) *
          rateTop
        ) + px;
    } else {
      scrollBar.style.top = topScrollOffsetX + px;
      innerChannels.style.top =
        -(
          (document.getElementById('scrollBar').getBoundingClientRect().top -
            document.getElementById('scrollInner').getBoundingClientRect().top -
            2) *
          rateTop
        ) + px;
    }
  }
  document
    .getElementById('scrollWrapper')
    .addEventListener('mousemove', scrollBarMove);

  function mouseUp() {
    document.getElementById('page').classList.remove('select-disabled');
    document
      .getElementById('scrollWrapper')
      .removeEventListener('mousemove', scrollBarMove);
  }
  window.addEventListener('mouseup', mouseUp);
}
let stateScrollSizeShrink = 0;
function scrollSizeShrink() {
  if (stateScrollSizeShrink === 0) {
    const px = 'px';
    const scrollSize = parseFloat(
      getComputedStyle(scrollBar).height.split('p')[0]
    );
    const contentSize = parseFloat(
      getComputedStyle(scrollContainer).height.split('p')[0]
    );
    const trueContentSize = parseFloat(
      getComputedStyle(innerChannels).height.split('p')[0]
    );
    const newScrollSize = scrollSize * (contentSize / trueContentSize);
    scrollBar.style.height = Math.ceil(newScrollSize) + px;
    stateScrollSizeShrink += 1;
  }
}

document
  .getElementById('scrollBar')
  .addEventListener('mousedown', scrollBarChannels);

let deltYs = 0;
function scrollWheelScroll(e) {
  const px = 'px';
  const innerChannelsHeight = innerChannels.getBoundingClientRect().height;
  const scrollContainerHeight = scrollContainer.getBoundingClientRect().height;
  const scrollBarHeight = scrollBar.getBoundingClientRect().height;
  const topX = parseFloat(getComputedStyle(scrollBar).top.split('p')[0]);
  const emptySpaceScrollContainer = scrollContainerHeight - scrollBarHeight;
  const rateTop =
    (innerChannelsHeight - scrollContainerHeight) / emptySpaceScrollContainer;
  deltYs = topX;
  const deadHeight = innerChannelsHeight - scrollContainerHeight;
  deltYs += (e.deltaY / 100) * 30;
  if (deltYs <= 0) {
    deltYs = 0;
    scrollBar.style.top = 0 + px;
    innerChannels.style.top = 0 + px;
  } else if (deltYs < emptySpaceScrollContainer) {
    scrollBar.style.top = deltYs + px;
    innerChannels.style.top = -(deltYs * rateTop) + px;
  } else if (deltYs >= emptySpaceScrollContainer) {
    scrollBar.style.top = emptySpaceScrollContainer + px;
    innerChannels.style.top = -deadHeight + px;
  }
  e.preventDefault();
}
document
  .getElementById('scrollWrapper')
  .addEventListener('wheel', scrollWheelScroll);

function cardsScroll(array) {
  const cardImgoverX = array[1];
  const cardLayoutX = array[2];
  const cardScrollX = array[3];
  const cardScrollBarX = array[5];
  const infoWrapper = array[6];
  const cardInfoX = array[7];
  function scrollBarCards(e) {
    const scrollPosition = parseFloat(
      getComputedStyle(document.getElementById(cardScrollBarX)).top.split(
        'p'
      )[0]
    );
    const scrollBarHeight = document
      .getElementById(cardScrollBarX)
      .getBoundingClientRect().height;
    const scrollHeight = document
      .getElementById(cardScrollX)
      .getBoundingClientRect().height;
    const px = 'px';
    document.getElementById('page').classList.add('select-disabled');
    document
      .getElementById(cardLayoutX)
      .classList.add('content-block_show-over');
    function mouseMove(ev) {
      const infoWrapperElem = document.getElementById(infoWrapper);
      const cardScrollBarElem = document.getElementById(cardScrollBarX);
      const cardLayout = document.getElementById(cardLayoutX);
      const infoWrapperElemHeight =
        infoWrapperElem.getBoundingClientRect().height;
      const diffHeight =
        infoWrapperElemHeight - cardLayout.getBoundingClientRect().height;
      const styleTop = ev.clientY - e.clientY + scrollPosition;
      const emptySpace = scrollHeight - scrollBarHeight;
      const rateMove = diffHeight / emptySpace;
      cardScrollBarElem.style.top =
        ev.clientY - e.clientY + scrollPosition + px;
      const cardInfoHeight = document
        .getElementById(cardInfoX)
        .getBoundingClientRect().height;
      const cardImgoverHeight = 370;
      if (cardInfoHeight < cardImgoverHeight) {
        infoWrapperElem.style.top =
          (ev.clientY - e.clientY + scrollPosition + 14) * rateMove + px;
      } else {
        infoWrapperElem.style.top =
          -(ev.clientY - e.clientY + scrollPosition + 14) * rateMove + px;
      }
      if (styleTop < 1) {
        cardScrollBarElem.style.top = 0 + px;
        infoWrapperElem.style.top = 0 + px;
      } else if (styleTop > emptySpace) {
        cardScrollBarElem.style.top = emptySpace + px;
        infoWrapperElem.style.top = -diffHeight - 16 + px;
      }
    }
    function outOfRange(eventy) {
      if (eventy.target) {
        document
          .getElementById(eventy.target.id)
          .removeEventListener('mousemove', mouseMove);
      }
    }
    document
      .getElementById(cardLayoutX)
      .addEventListener('mouseleave', outOfRange);

    const infoWrapperElem = document.getElementById(infoWrapper);
    const infoWrapperElemHeight =
      infoWrapperElem.getBoundingClientRect().height;
    const cardLayout = document.getElementById(cardLayoutX);
    const diffHeight =
      infoWrapperElemHeight - cardLayout.getBoundingClientRect().height;

    const topCardScrollBar = document
      .getElementById(cardScrollBarX)
      .getBoundingClientRect().top;
    const emptySpace = scrollHeight - scrollBarHeight;
    const scrlElem = document.getElementById(cardScrollBarX);
    const topCardScroll = document
      .getElementById(cardScrollX)
      .getBoundingClientRect().top;
    const mouseOffset = e.clientY - topCardScroll;
    function scrollJump() {
      if (e.clientY < topCardScrollBar) {
        scrlElem.style.top =
          scrollPosition - (scrollPosition - mouseOffset) - 2 + px;
        infoWrapperElem.style.top =
          (mouseOffset / emptySpace) * diffHeight * -1 + px;
      } else if (e.clientY > topCardScrollBar) {
        scrlElem.style.top =
          scrollPosition -
          scrollBarHeight -
          (scrollPosition - mouseOffset) +
          px;
        infoWrapperElem.style.top =
          ((mouseOffset - scrollBarHeight) / emptySpace) * -diffHeight + px;
      }
    }

    if (
      e.clientY < topCardScrollBar ||
      e.clientY > topCardScrollBar + scrollBarHeight
    ) {
      scrollJump();
    } else {
      document
        .getElementById(cardLayoutX)
        .addEventListener('mousemove', mouseMove);
    }

    function mouseUp() {
      document.getElementById('page').classList.remove('select-disabled');
      document
        .getElementById(cardLayoutX)
        .classList.remove('content-block_show-over');
      document
        .getElementById(cardLayoutX)
        .removeEventListener('mousemove', mouseMove);
    }
    document.getElementById(cardLayoutX).addEventListener('mouseup', mouseUp);
  }

  function getScrollBar() {
    const infoWrapperHeight = document
      .getElementById(infoWrapper)
      .getBoundingClientRect().height;
    const cardImgoverHeight = document
      .getElementById(cardImgoverX)
      .getBoundingClientRect().height;
    if (infoWrapperHeight + 32 < cardImgoverHeight) {
      document
        .getElementById(cardLayoutX)
        .classList.add('content-block_disabled');
    } else {
      document
        .getElementById(cardScrollX)
        .addEventListener('mousedown', scrollBarCards);
    }
  }

  getScrollBar();
}

function prepId(id) {
  const tagQ = document.getElementById(id).getElementsByTagName('*');
  const array = [];
  for (let i = 1; i < tagQ.length; i += 1) {
    array.push(tagQ[i].id);
  }
  cardsScroll(array);
}
const id1 = 'card#1';
document
  .getElementById(id1)
  .addEventListener('mouseover', prepId.bind(null, id1));
const id2 = 'card#2';
document
  .getElementById(id2)
  .addEventListener('mouseover', prepId.bind(null, id2));
const id3 = 'card#3';
document
  .getElementById(id3)
  .addEventListener('mouseover', prepId.bind(null, id3));
const id4 = 'card#4';
document
  .getElementById(id4)
  .addEventListener('mouseover', prepId.bind(null, id4));
