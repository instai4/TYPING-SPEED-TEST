  // Cursor
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a,button,#typing-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '48px'; cursor.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px'; cursor.style.height = '24px';
    });
  });

  // Paragraphs
  const paragraphs = [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. The five boxing wizards jump quickly. Sphinx of black quartz judge my vow. Two driven jocks help fax my big quiz. Five quacking zephyrs jolt my wax bed. The jay pig fox zebra and my wolves quack.",
    "Data science is an interdisciplinary field that uses scientific methods processes algorithms and systems to extract knowledge from structured and unstructured data. It is related to data mining machine learning and big data. Data science is a concept that unifies statistics data analysis informatics and their related methods. Machine learning is a method of data analysis that automates analytical model building.",
    "Python is a high level general purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage collected. It supports multiple programming paradigms including structured procedural object oriented and functional programming. It is often described as a batteries included language due to its comprehensive standard library.",
    "Artificial intelligence is intelligence demonstrated by machines as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term artificial intelligence had previously been used to describe machines that mimic and display human cognitive skills.",
    "Machine learning is a branch of artificial intelligence and computer science which focuses on the use of data and algorithms to imitate the way that humans learn gradually improving its accuracy. Machine learning is an important component of the growing field of data science. Through the use of statistical methods algorithms are trained to make classifications or predictions uncovering key insights within data mining projects.",
    "A neural network is a series of algorithms that endeavors to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates. Neural networks can adapt to changing input so the network generates the best possible result without needing to redesign the output criteria. Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning.",
    "SQL stands for structured query language and is a programming language used to communicate with and manipulate databases. Databases using SQL are called relational databases because the data is stored in tables which are related by common fields. SQL statements are used to perform tasks such as update data on a database or retrieve data from a database. Some common SQL commands are select insert update delete create and drop.",
    "GitHub is a provider of internet hosting for software development and version control using Git. It offers the distributed version control and source code management functionality of Git plus its own features. It provides access control and several collaboration features such as bug tracking feature requests task management continuous integration and wikis for every project. It is commonly used to host open source projects.",
    "Java is a high level class based object oriented programming language that is designed to have as few implementation dependencies as possible. It is a general purpose programming language intended to let programmers write once run anywhere meaning that compiled Java code can run on all platforms that support Java without the need to recompile. Java applications are typically compiled to bytecode that can run on any Java virtual machine.",
    "Statistics is the discipline that concerns the collection organization analysis interpretation and presentation of data. In applying statistics to a scientific industrial or social problem it is conventional to begin with a statistical population or a statistical model to be studied. Populations can be diverse groups of people or objects such as all people living in a country or every atom composing a crystal.",
  ];

  const typingP = document.getElementById('typing-p');
  const inpField = document.getElementById('inp-field');
  const timeTag = document.getElementById('time-val');
  const wpmTag = document.getElementById('wpm-val');
  const cpmTag = document.getElementById('cpm-val');
  const errTag = document.getElementById('err-val');
  const accFill = document.getElementById('acc-fill');
  const accVal = document.getElementById('acc-val');
  const progressFill = document.getElementById('progress-fill');
  const progressPct = document.getElementById('progress-pct');
  const resultOverlay = document.getElementById('result-overlay');

  let timer, maxTime = 60, timeLeft, charIndex, mistakes, isTyping;

  function setDifficulty(btn) {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    maxTime = parseInt(btn.dataset.time);
    resetGame();
  }

  function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingP.innerHTML = '';
    paragraphs[ranIndex].split('').forEach(char => {
      typingP.innerHTML += `<span>${char}</span>`;
    });
    typingP.querySelectorAll('span')[0].classList.add('active');
    document.addEventListener('keydown', () => inpField.focus());
    document.getElementById('typing-box').addEventListener('click', () => inpField.focus());
  }

  function updateAccuracy() {
    const total = charIndex;
    const correct = total - mistakes;
    const acc = total === 0 ? 100 : Math.max(0, Math.round((correct / total) * 100));
    accFill.style.width = acc + '%';
    accFill.style.background = acc >= 90 ? '#33FF57' : acc >= 70 ? '#FBFF48' : '#FF2A2A';
    accVal.textContent = acc + '%';
    return acc;
  }

  function updateProgress() {
    const total = typingP.querySelectorAll('span').length;
    const pct = total === 0 ? 0 : Math.round((charIndex / total) * 100);
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct + '%';
  }

  function initTyping() {
    const characters = typingP.querySelectorAll('span');
    const typedChar = inpField.value.split('')[charIndex];

    if (charIndex < characters.length - 1 && timeLeft > 0) {
      if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
      }

      if (typedChar == null) {
        if (charIndex > 0) {
          charIndex--;
          if (characters[charIndex].classList.contains('incorrect')) mistakes--;
          characters[charIndex].classList.remove('correct', 'incorrect');
        }
      } else {
        if (characters[charIndex].innerText === typedChar) {
          characters[charIndex].classList.add('correct');
        } else {
          mistakes++;
          characters[charIndex].classList.add('incorrect');
        }
        charIndex++;
      }

      characters.forEach(s => s.classList.remove('active'));
      characters[charIndex].classList.add('active');

      // Scroll active char into view
      characters[charIndex].scrollIntoView({ block: 'nearest' });

      let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      wpmTag.textContent = wpm;
      errTag.textContent = mistakes;
      cpmTag.textContent = Math.max(0, charIndex - mistakes);

      updateAccuracy();
      updateProgress();
    } else {
      clearInterval(timer);
      inpField.value = '';
    }
  }

  function initTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timeTag.textContent = timeLeft;
      if (timeLeft <= 10) timeTag.classList.add('warning');

      let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
      wpmTag.textContent = wpm;

      if (timeLeft === 0) showResult();
    }
  }

  function showResult() {
    clearInterval(timer);
    const wpm = parseInt(wpmTag.textContent);
    const cpm = parseInt(cpmTag.textContent);
    const acc = updateAccuracy();

    document.getElementById('res-wpm').textContent = wpm;
    document.getElementById('res-cpm').textContent = cpm;
    document.getElementById('res-acc').textContent = acc + '%';
    document.getElementById('res-err').textContent = mistakes;

    let tag = '';
    if (wpm >= 80) tag = '🔥 Blazing fast! You\'re a keyboard warrior.';
    else if (wpm >= 60) tag = '⚡ Solid speed! Above average, keep pushing.';
    else if (wpm >= 40) tag = '👍 Good pace. Practice makes perfect.';
    else tag = '💪 Keep practicing, soldier. You\'ll get there.';
    document.getElementById('res-tagline').textContent = tag;

    resultOverlay.classList.add('show');
  }

  function resetGame() {
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = '';
    timeTag.textContent = timeLeft;
    timeTag.classList.remove('warning');
    wpmTag.textContent = 0;
    cpmTag.textContent = 0;
    errTag.textContent = 0;
    accFill.style.width = '100%';
    accFill.style.background = '#33FF57';
    accVal.textContent = '100%';
    progressFill.style.width = '0%';
    progressPct.textContent = '0%';
    resultOverlay.classList.remove('show');
    loadParagraph();
    inpField.focus();
  }

  document.getElementById('try-btn').addEventListener('click', resetGame);
  document.getElementById('overlay-reset').addEventListener('click', resetGame);
  inpField.addEventListener('input', initTyping);

  loadParagraph();
  timeLeft = maxTime;
  // Entry screen
document.getElementById('entry-btn').addEventListener('click', () => {
  document.getElementById('entry-screen').classList.add('hide');
  setTimeout(() => {
    document.getElementById('entry-screen').style.display = 'none';
  }, 650);
  inpField.focus();
});
