(function () {
  'use strict';

  var output = document.getElementById('output');
  var inputLine = document.getElementById('input-line');
  var commandInput = document.getElementById('command-input');
  var terminal = document.getElementById('terminal');

  var history = [];
  var historyPos = -1;
  var tempInput = '';

  var COMPLETABLE = [
    'help', 'about', 'projects', 'links', 'whoami', 'date',
    'neofetch', 'history', 'clear', 'parrotzone', 'parrotcross', 'adventure',
    'echo', 'ls', 'cat', 'pwd', 'sudo', 'rm', 'exit', 'ping', 'vim', 'cd'
  ];

  var BANNER = [
    { t: '\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588   \u2588\u2588 \u2588\u2588 \u2588\u2588\u2588    \u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588    \u2588\u2588', c: 'ascii-l1' },
    { t: '\u2588\u2588   \u2588\u2588 \u2588\u2588   \u2588\u2588 \u2588\u2588    \u2588\u2588  \u2588\u2588 \u2588\u2588  \u2588\u2588 \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588 \u2588\u2588   \u2588\u2588 \u2588\u2588      \u2588\u2588   \u2588\u2588 \u2588\u2588\u2588\u2588   \u2588\u2588', c: 'ascii-l2' },
    { t: '\u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588    \u2588\u2588   \u2588\u2588\u2588   \u2588\u2588 \u2588\u2588 \u2588\u2588\u2588\u2588 \u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2588\u2588 \u2588\u2588  \u2588\u2588', c: 'ascii-l3' },
    { t: '\u2588\u2588      \u2588\u2588   \u2588\u2588 \u2588\u2588    \u2588\u2588  \u2588\u2588 \u2588\u2588  \u2588\u2588 \u2588\u2588  \u2588\u2588  \u2588\u2588 \u2588\u2588   \u2588\u2588      \u2588\u2588 \u2588\u2588   \u2588\u2588 \u2588\u2588  \u2588\u2588 \u2588\u2588', c: 'ascii-l4' },
    { t: '\u2588\u2588      \u2588\u2588   \u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588  \u2588\u2588   \u2588\u2588 \u2588\u2588 \u2588\u2588      \u2588\u2588 \u2588\u2588   \u2588\u2588 \u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2588\u2588   \u2588\u2588 \u2588\u2588   \u2588\u2588\u2588\u2588', c: 'ascii-l5' }
  ];

  /* ── Helpers ──────────────────────────────── */

  function esc(text) {
    var el = document.createElement('span');
    el.textContent = text;
    return el.innerHTML;
  }

  function print(html, cls) {
    var line = document.createElement('div');
    line.className = 'line' + (cls ? ' ' + cls : '');
    line.innerHTML = html;
    output.appendChild(line);
    scrollBottom();
  }

  function printText(text, cls) {
    print(esc(text), cls);
  }

  function blank() {
    print('&nbsp;');
  }

  function scrollBottom() {
    terminal.scrollTop = terminal.scrollHeight;
  }

  function focus() {
    commandInput.focus();
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function promptHTML() {
    return '<span class="prompt"><span class="prompt-user">guest@proxima</span> ' +
           '<span class="prompt-path">~</span> ' +
           '<span class="prompt-symbol">$</span></span> ';
  }

  /* ── Boot sequence ────────────────────────── */

  async function boot() {
    var steps = [
      { text: '[establishing connection...]', cls: 'c-dim', wait: 500 },
      { text: '[authenticating...]',          cls: 'c-dim', wait: 400 },
      { text: '[connection established]',     cls: 'c-ok',  wait: 500 },
      { text: '',                             cls: '',      wait: 200 }
    ];

    for (var i = 0; i < steps.length; i++) {
      if (steps[i].text === '') { blank(); }
      else { printText(steps[i].text, steps[i].cls); }
      await sleep(steps[i].wait);
    }

    for (var j = 0; j < BANNER.length; j++) {
      print('<span class="' + BANNER[j].c + '">' + esc(BANNER[j].t) + '</span>', 'ascii-banner');
      await sleep(55);
    }

    await sleep(350);
    blank();
    print('<span class="c-dim">Welcome to proximasan\'s terminal.</span>');
    print('<span class="c-dim">Type </span><span class="c-head">help</span><span class="c-dim"> for available commands.</span>');
    blank();

    inputLine.classList.remove('hidden');
    focus();
  }

  /* ── Commands ─────────────────────────────── */

  var cmds = {};

  cmds.help = function () {
    var list = [
      ['help',       'Show this help message'],
      ['about',      'Who is proximasan?'],
      ['projects',   'View projects'],
      ['links',      'Social & web links'],
      ['neofetch',   'System information'],
      ['whoami',     'Display current user'],
      ['date',       'Show current date'],
      ['history',    'Command history'],
      ['clear',      'Clear terminal'],
      ['parrotcross', 'Play a game'],
      ['adventure',   'Text adventure']
    ];
    blank();
    print('<span class="c-head">  Available Commands</span>');
    print('<span class="c-sep">  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>');
    for (var i = 0; i < list.length; i++) {
      var label = list[i][0];
      while (label.length < 12) label += ' ';
      print('  <span class="c-label">' + label + '</span> <span class="c-dim">' + list[i][1] + '</span>');
    }
    blank();
  };

  cmds.about = function () {
    blank();
    print('<span class="c-head">  proximasan</span>');
    print('<span class="c-sep">  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>');
    print('<span class="c-val">  Creative developer & image synthesis explorer.</span>');
    print('<span class="c-val">  Building things at the intersection of code</span>');
    print('<span class="c-val">  and visual art.</span>');
    blank();
    print('  <span class="c-dim">\u2192</span> <a class="c-link" href="https://proximacentaurib.xyz" target="_blank">proximacentaurib.xyz</a>');
    blank();
  };

  cmds.projects = function () {
    blank();
    print('<span class="c-head">  Projects</span>');
    print('<span class="c-sep">  \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</span>');
    blank();
    print('  <span class="c-label">[01]</span> <span class="c-val">Proxima Centauri B</span>');
    print('  <span class="c-dim">     Image synthesis & AI art</span>');
    print('       <span class="c-dim">\u2192</span> <a class="c-link" href="https://proximacentaurib.xyz" target="_blank">proximacentaurib.xyz</a>');
    blank();
    print('  <span class="c-label">[02]</span> <span class="c-val">parrotzone</span>');
    print('  <span class="c-dim">     Infos, tools & studies for Stable & Disco Diffusion</span>');
    print('       <span class="c-dim">\u2192</span> <a class="c-link" href="https://proximacentaurib.notion.site/parrot-zone-74a5c04d4feb4f12b52a41fc8750b205" target="_blank">parrotzone</a>');
    blank();
    print('  <span class="c-label">[03]</span> <span class="c-val">approximate friend</span>');
    print('  <span class="c-dim">     Music on Bandcamp</span>');
    print('       <span class="c-dim">\u2192</span> <a class="c-link" href="https://approximatefriend.bandcamp.com" target="_blank">approximatefriend.bandcamp.com</a>');
    blank();
    print('  <span class="c-label">[04]</span> <span class="c-val">tadpole studio</span>');
    print('  <span class="c-dim">     Local AI music generation UI for open-source models</span>');
    print('       <span class="c-dim">\u2192</span> <a class="c-link" href="https://github.com/proximasan/tadpole-studio" target="_blank">github.com/proximasan/tadpole-studio</a>');
    blank();
  };

  cmds.links = function () {
    blank();
    print('<span class="c-head">  Links</span>');
    print('<span class="c-sep">  \u2500\u2500\u2500\u2500\u2500</span>');
    blank();
    print('  <span class="c-dim">  web</span>');
    print('  <span class="c-label">website     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://proximacentaurib.xyz" target="_blank">proximacentaurib.xyz</a>');
    print('  <span class="c-label">github      </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://github.com/proximasan" target="_blank">github.com/proximasan</a>');
    print('  <span class="c-label">huggingface </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://huggingface.co/proxima" target="_blank">huggingface.co/proxima</a>');
    print('  <span class="c-label">substack    </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://substack.com/@proximasan" target="_blank">substack.com/@proximasan</a>');
    print('  <span class="c-label">discord     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://discord.com/users/402256924852355073" target="_blank">profile</a> <span class="c-dim">\u2502</span> <a class="c-link" href="https://discord.gg/b2TCh6jjXx" target="_blank">server</a>');
    print('  <span class="c-label">ko-fi       </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://ko-fi.com/proximasan" target="_blank">ko-fi.com/proximasan</a>');
    blank();
    print('  <span class="c-dim">  socials</span>');
    print('  <span class="c-label">instagram   </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://instagram.com/proximacentaurib" target="_blank">@proximacentaurib</a>');
    print('  <span class="c-label">twitter     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://x.com/proximasan" target="_blank">@proximasan</a>');
    print('  <span class="c-label">bluesky     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://bsky.app/profile/proximacentaurib.xyz" target="_blank">@proximacentaurib.xyz</a>');
    print('  <span class="c-label">threads     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://www.threads.com/@proximacentaurib" target="_blank">@proximacentaurib</a>');
    print('  <span class="c-label">tiktok      </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://tiktok.com/@proximasan" target="_blank">@proximasan</a>');
    blank();
    print('  <span class="c-dim">  music</span>');
    print('  <span class="c-label">bandcamp    </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://approximatefriend.bandcamp.com" target="_blank">approximatefriend.bandcamp.com</a>');
    print('  <span class="c-label">spotify     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://open.spotify.com/user/trqf9uo75uqy656yapxv8ink3" target="_blank">personal</a> <span class="c-dim">\u2502</span> <a class="c-link" href="https://open.spotify.com/artist/4fvPNIDg5oc6C3023lDT0T" target="_blank">approximate friend</a>');
    print('  <span class="c-label">youtube     </span> <span class="c-dim">\u2192</span> <a class="c-link" href="https://youtube.com/@proximacentaurib4654" target="_blank">@proximacentaurib</a>');
    blank();
  };

  cmds.whoami = function () {
    printText('guest@proximasan');
  };

  cmds.date = function () {
    printText(new Date().toString());
  };

  cmds.clear = function () {
    output.innerHTML = '';
  };

  cmds.history = function () {
    blank();
    if (history.length === 0) {
      print('  <span class="c-dim">No commands in history.</span>');
    } else {
      for (var i = 0; i < history.length; i++) {
        var num = String(i + 1);
        while (num.length < 4) num = ' ' + num;
        print('  <span class="c-dim">' + num + '</span>  ' + esc(history[i]));
      }
    }
    blank();
  };

  cmds.neofetch = function () {
    var art = [
      '  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  ',
      '  \u2588\u2588    \u2588\u2588  ',
      '  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588  ',
      '  \u2588\u2588        ',
      '  \u2588\u2588        '
    ];
    var info = [
      ['OS',       'proximaOS 1.0'],
      ['Host',     'proximasan.github.io'],
      ['Shell',    'zsh 5.9'],
      ['Theme',    'violet-phosphor'],
      ['Font',     'JetBrains Mono']
    ];

    blank();
    for (var i = 0; i < art.length; i++) {
      var a = '<span class="ascii-l3">' + art[i] + '</span>';
      var label = info[i][0];
      while (label.length < 10) label += ' ';
      var inf = '<span class="c-label">' + label + '</span> <span class="c-dim">' + info[i][1] + '</span>';
      print('  ' + a + '   ' + inf);
    }

    blank();
    var colors = '';
    var palette = ['#4B0082', '#6a28b9', '#9400D3', '#BA55D3', '#EE82EE', '#9b6dff', '#c084fc', '#818cf8'];
    for (var k = 0; k < palette.length; k++) {
      colors += '<span style="background:' + palette[k] + '">   </span>';
    }
    print('  ' + '          ' + '   ' + colors);
    blank();
  };

  cmds.parrotzone = function () {
    print('<span class="c-ok">Entering parrotzone...</span>');
    setTimeout(function () {
      window.location.href = 'https://proximacentaurib.notion.site/parrot-zone-74a5c04d4feb4f12b52a41fc8750b205';
    }, 800);
  };

  cmds.pwd = function () {
    printText('/home/guest/void');
  };

  cmds.ls = function (args) {
    if (args === '-la' || args === '-l' || args === '-a' || args === '-al') {
      printText('total 42');
      print('<span class="c-dim">drwxr-xr-x  2 guest proxima  4096 Feb 25 00:00</span> <span class="c-label">.</span>');
      print('<span class="c-dim">drwxr-xr-x  3 root  root     4096 Feb 25 00:00</span> <span class="c-label">..</span>');
      print('<span class="c-dim">-rw-r--r--  1 guest proxima   220 Feb 25 00:00</span> <span class="c-val">.bashrc</span>');
      print('<span class="c-dim">-rw-r--r--  1 guest proxima    42 Feb 25 00:00</span> <span class="c-ok">README.md</span>');
      print('<span class="c-dim">-rw-r--r--  1 guest proxima     0 Feb 25 00:00</span> <span class="c-warn">secrets.txt</span>');
      print('<span class="c-dim">drwxr-xr-x  2 guest proxima  4096 Feb 25 00:00</span> <span class="c-label">projects/</span>');
      print('<span class="c-dim">-rwxr-xr-x  1 guest proxima  8192 Feb 25 00:00</span> <span class="c-ok">parrotcross</span>');
    } else {
      print('<span class="c-val">.bashrc</span>  <span class="c-ok">README.md</span>  <span class="c-warn">secrets.txt</span>  <span class="c-label">projects/</span>  <span class="c-ok">parrotcross</span>');
    }
  };

  cmds.cat = function (args) {
    if (!args) {
      print('<span class="c-err">cat: missing operand</span>');
      return;
    }
    if (args === 'README.md') {
      blank();
      printText('  # Welcome');
      printText('  You found the readme. There\'s not much here.');
      printText('  Try `about` or `projects` instead.');
      blank();
    } else if (args === 'secrets.txt') {
      print('  <span class="c-warn">Nice try.</span>');
    } else if (args === '.bashrc') {
      printText('  # nothing to see here');
      printText('  export PS1="guest@proxima ~ $ "');
      printText('  alias please="sudo"');
    } else {
      print('<span class="c-err">cat: ' + esc(args) + ': No such file or directory</span>');
    }
  };

  cmds.echo = function (args) {
    if (!args) { blank(); }
    else { printText(args); }
  };

  cmds.ping = function () {
    print('<span class="c-ok">pong</span>');
  };

  cmds.sudo = function () {
    print('<span class="c-err">Permission denied:</span> <span class="c-dim">nice try though ;)</span>');
  };

  cmds.rm = function (args) {
    if (args && args.indexOf('-rf') !== -1) {
      print('<span class="c-err">rm: not today, friend.</span>');
    } else {
      print('<span class="c-err">rm: permission denied</span>');
    }
  };

  cmds.exit = function () {
    print('<span class="c-dim">There is no escape.</span>');
  };

  cmds.vim = function () {
    print('<span class="c-warn">You\'ve entered vim. Good luck getting out.</span>');
    print('<span class="c-dim">(jk, you\'re safe. type :q to quit... wait, that won\'t work here either)</span>');
  };

  cmds.cd = function (args) {
    if (!args || args === '~') {
      print('<span class="c-dim">Already home.</span>');
    } else {
      print('<span class="c-err">cd: ' + esc(args) + ': nowhere to go</span>');
    }
  };

  /* ── ParrotCross game ───────────────────────── */

  cmds.parrotcross = function () {
    print('<span class="c-ok">Starting ParrotCross...</span>');
    print('<span class="c-dim">Get the parrot safely across!</span>');
    setTimeout(startParrotCross, 500);
  };

  function startParrotCross() {
    var COLS = 20;
    var ROWS = 9;
    var px = 10, py = 0;
    var score = 0;
    var lives = 3;
    var alive = true;
    var running = true;
    var tick = 0;

    var lanes = [
      { type: 'safe' },
      { type: 'road', dir: 1,  speed: 4, segs: [[0,2],[10,2]] },
      { type: 'road', dir: -1, speed: 3, segs: [[0,2],[7,2],[14,2]] },
      { type: 'road', dir: 1,  speed: 5, segs: [[0,3],[10,3]] },
      { type: 'safe' },
      { type: 'water', dir: -1, speed: 4, segs: [[0,4],[10,4]] },
      { type: 'water', dir: 1,  speed: 3, segs: [[0,3],[7,3],[14,3]] },
      { type: 'water', dir: -1, speed: 5, segs: [[0,5],[10,5]] },
      { type: 'safe' }
    ];

    inputLine.classList.add('hidden');
    commandInput.blur();
    output.innerHTML = '';

    var gameEl = document.createElement('pre');
    gameEl.className = 'game-display';
    output.appendChild(gameEl);

    function onSeg(lane, x) {
      for (var i = 0; i < lane.segs.length; i++) {
        var s = lane.segs[i][0], len = lane.segs[i][1];
        for (var j = 0; j < len; j++) {
          if ((s + j) % COLS === x) return true;
        }
      }
      return false;
    }

    function segPart(lane, x) {
      for (var i = 0; i < lane.segs.length; i++) {
        var s = lane.segs[i][0], len = lane.segs[i][1];
        for (var j = 0; j < len; j++) {
          if ((s + j) % COLS === x) {
            if (j === 0) return 'first';
            if (j === len - 1) return 'last';
            return 'mid';
          }
        }
      }
      return null;
    }

    function checkHit() {
      var lane = lanes[py];
      if (lane.type === 'safe') return;
      if (lane.type === 'road' && onSeg(lane, px)) kill();
      else if (lane.type === 'water' && !onSeg(lane, px)) kill();
    }

    function kill() {
      lives--;
      if (lives <= 0) {
        alive = false;
        running = false;
        render();
        setTimeout(quit, 1500);
      } else {
        px = 10;
        py = 0;
      }
    }

    function quit() {
      running = false;
      clearInterval(loop);
      document.removeEventListener('keydown', onKey);
      output.innerHTML = '';
      inputLine.classList.remove('hidden');
      focus();
      if (score > 0 || !alive) {
        print('<span class="c-head">ParrotCross</span> <span class="c-dim">\u2500</span> <span class="c-val">Final score: ' + score + '</span>');
      }
    }

    function onKey(e) {
      if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        e.preventDefault();
        quit();
        return;
      }
      if (!alive) return;

      var nx = px, ny = py;
      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': ny++; break;
        case 'ArrowDown':  case 's': case 'S': ny--; break;
        case 'ArrowLeft':  case 'a': case 'A': nx--; break;
        case 'ArrowRight': case 'd': case 'D': nx++; break;
        default: return;
      }
      e.preventDefault();

      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
      px = nx;
      py = ny;

      if (py === ROWS - 1) {
        score++;
        px = 10;
        py = 0;
      }

      checkHit();
      render();
    }

    document.addEventListener('keydown', onKey);

    function update() {
      tick++;
      for (var i = 0; i < lanes.length; i++) {
        var lane = lanes[i];
        if (lane.type === 'safe') continue;
        if (tick % lane.speed !== 0) continue;

        for (var j = 0; j < lane.segs.length; j++) {
          lane.segs[j][0] = (lane.segs[j][0] + lane.dir + COLS) % COLS;
        }

        if (lane.type === 'water' && py === i) {
          px = (px + lane.dir + COLS) % COLS;
        }
      }
      if (alive) checkHit();
    }

    function render() {
      var buf = [];
      var hearts = '';
      for (var h = 0; h < 3; h++) {
        hearts += h < lives
          ? '<span class="c-err">\u2665</span>'
          : '<span class="c-dim">\u2665</span>';
      }

      buf.push(' <span class="c-head">PARROTCROSS</span>   <span class="c-dim">Score:</span> <span class="c-ok">' + score + '</span>   ' + hearts);
      buf.push('');

      for (var y = ROWS - 1; y >= 0; y--) {
        var lane = lanes[y];
        var row = ' ';

        for (var x = 0; x < COLS; x++) {
          if (px === x && py === y) {
            row += '\uD83E\uDD9C';
          } else if (lane.type === 'safe') {
            row += y === ROWS - 1
              ? '<span class="c-ok">\u2591\u2591</span>'
              : '<span class="c-dim">\u00B7\u00B7</span>';
          } else if (lane.type === 'road') {
            row += onSeg(lane, x)
              ? '<span class="c-err">\u2588\u2588</span>'
              : '<span class="c-dim">\u2500\u2500</span>';
          } else {
            row += onSeg(lane, x)
              ? '<span class="c-warn">\u2550\u2550</span>'
              : '<span style="color:#3b82f6">~~</span>';
          }
        }

        if (y === ROWS - 1) row += '  <span class="c-ok">FINISH</span>';
        else if (y === 0) row += '  <span class="c-dim">START</span>';

        buf.push(row);
      }

      buf.push('');
      buf.push(alive
        ? ' <span class="c-dim">[\u2190\u2191\u2193\u2192/WASD] Move  [Q] Quit</span>'
        : ' <span class="c-err">GAME OVER!</span> <span class="c-dim">Score: ' + score + '</span>');

      gameEl.innerHTML = buf.join('\n');
    }

    var loop = setInterval(function () {
      if (!running) return;
      update();
      render();
    }, 150);

    render();
  }

  /* ── Text adventure ────────────────────────── */

  var PARROT_ART = [
    '              \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588',
    '            \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2588',
    '          \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '        \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '      \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2588\u2588',
    '  \u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '  \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '  \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2588',
    '    \u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588',
    '    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588'
  ];
  var PARROT_COLORS = [
    '#4B0082','#4B0082','#4B0082','#4B0082',
    '#6a28b9','#6a28b9','#6a28b9','#6a28b9',
    '#9400D3','#9400D3','#9400D3','#9400D3',
    '#BA55D3','#BA55D3','#BA55D3','#BA55D3',
    '#EE82EE','#EE82EE','#EE82EE'
  ];

  function parrotHTML() {
    return PARROT_ART.map(function (line, i) {
      return '<span style="color:' + PARROT_COLORS[i] + '">' + esc(line) + '</span>';
    });
  }

  var advScenes = {
    start: {
      text: function () { return [
        '',
        '<span class="c-dim">You open your eyes.</span>',
        '',
        'A dark room hums around you. Server racks stretch',
        'in rows, their LEDs blinking like faint stars.',
        '',
        'Something <span class="c-warn">squawks</span> in the shadows.',
      ]; },
      choices: function () { return [
        { label: 'Look around', next: 'look' },
        { label: 'Follow the sound', next: 'meet_parrot', fx: 'parrot' }
      ]; }
    },
    look: {
      text: function () { return [
        '',
        'Your eyes adjust to the dark.',
        '',
        'Rows of server racks. Warm air. The hum of machines.',
        'On top of the nearest rack, a <span class="c-ok">parrot</span> watches you',
        'with one bright eye.',
        '',
        'A door glows faintly to the north.',
      ]; },
      choices: function () { return [
        { label: 'Approach the parrot', next: 'meet_parrot', fx: 'parrot' },
        { label: 'Head for the door', next: 'corridor' }
      ]; }
    },
    meet_parrot: {
      text: function () {
        var lines = [''];
        lines = lines.concat(parrotHTML());
        lines.push('');
        lines.push('The parrot tilts its head.');
        lines.push('');
        lines.push('<span class="c-ok">"You\'re not supposed to be here,"</span> it says.');
        lines.push('<span class="c-ok">"Neither am I."</span>');
        lines.push('');
        lines.push('It ruffles its feathers.');
        lines.push('<span class="c-ok">"Follow me if you want out."</span>');
        return lines;
      },
      choices: function () { return [
        { label: 'Follow the parrot', next: 'corridor' },
        { label: 'Stay behind', next: 'alone_end' }
      ]; }
    },
    corridor: {
      text: function (s) {
        var lines = [
          '',
          'A corridor stretches ahead, lit by red emergency strips.',
          '',
          'Two doors. One marked <span class="c-head">BRIDGE</span>, one marked <span class="c-head">LAB</span>.',
        ];
        if (s.parrot) {
          lines.push('');
          lines.push('The parrot perches above the BRIDGE door');
          lines.push('and taps it with its beak.');
        } else {
          lines.push('');
          lines.push('<span class="c-dim">It\'s very quiet.</span>');
        }
        return lines;
      },
      choices: function () { return [
        { label: 'Bridge', next: 'bridge' },
        { label: 'Lab', next: 'lab' }
      ]; }
    },
    lab: {
      text: function () { return [
        '',
        'The lab is wrecked. Overturned chairs, shattered glass.',
        'A monitor flickers in the corner.',
        '',
        'The screen reads: <span class="c-warn">"SPECIMEN LOG \u2500 PROJECT PARROT"</span>',
      ]; },
      choices: function () { return [
        { label: 'Read the logs', next: 'lab_logs', fx: 'logs' },
        { label: 'Go back', next: 'corridor' }
      ]; }
    },
    lab_logs: {
      text: function () { return [
        '',
        '<span class="c-dim">"Day 3: Subject acquired language."</span>',
        '<span class="c-dim">"Day 7: Subject began asking questions</span>',
        '<span class="c-dim"> we couldn\'t answer."</span>',
        '<span class="c-dim">"Day 12: Subject escaped containment."</span>',
        '',
        'The final entry:',
        '<span class="c-warn">"It knows the way home. It keeps saying</span>',
        '<span class="c-warn"> one word: Proxima."</span>',
      ]; },
      choices: function () { return [
        { label: 'Go back', next: 'corridor' }
      ]; }
    },
    bridge: {
      text: function (s) {
        var lines = [
          '',
          'The bridge opens to a wall of stars.',
          'An ocean of light stretches beyond the viewport.',
          '',
          'A navigation console blinks: <span class="c-head">DESTINATION?</span>',
        ];
        if (s.parrot) {
          lines.push('');
          lines.push('The parrot lands softly on the console.');
          lines.push('<span class="c-ok">"Proxima,"</span> it whispers. <span class="c-ok">"Type it."</span>');
        } else if (s.logs) {
          lines.push('');
          lines.push('You remember the logs. The parrot kept');
          lines.push('saying one word: <span class="c-warn">Proxima</span>.');
        } else {
          lines.push('');
          lines.push('<span class="c-dim">You have no idea where you are.</span>');
        }
        return lines;
      },
      choices: function (s) {
        var c = [];
        if (s.parrot || s.logs) {
          c.push({ label: 'Type "Proxima Centauri"', next: 'good_end' });
        }
        c.push({ label: 'Type "Earth"', next: 'earth_end' });
        c.push({ label: 'Stare at the stars', next: 'drift_end' });
        return c;
      }
    },
    good_end: {
      text: function (s) {
        var lines = [
          '',
          'You type: <span class="c-head">PROXIMA CENTAURI B</span>',
          '',
          'The ship shudders. Stars blur into streaks of light.',
        ];
        if (s.parrot) {
          lines.push('');
          lines.push('The parrot settles on the console.');
          lines.push('<span class="c-ok">"Home,"</span> it says softly.');
        }
        lines.push('');
        lines.push('Through the viewport, a red dwarf star grows larger.');
        lines.push('Warmer. Closer.');
        lines.push('');
        lines.push('You made it.');
        if (s.parrot) {
          lines.push('');
          lines = lines.concat(parrotHTML());
        }
        lines.push('');
        lines.push('<span class="c-head">                  THE END</span>');
        return lines;
      },
      choices: function () { return [
        { label: 'Play again', next: '_restart' },
        { label: 'Exit', next: '_quit' }
      ]; }
    },
    earth_end: {
      text: function (s) {
        var lines = [
          '',
          'You type: <span class="c-head">EARTH</span>',
          '',
          'The console buzzes.',
          '<span class="c-err">"DESTINATION NOT FOUND IN CURRENT GALAXY."</span>',
        ];
        if (s.parrot) {
          lines.push('');
          lines.push('The parrot sighs deeply.');
        }
        lines.push('');
        lines.push('<span class="c-dim">You\'re a long way from home.</span>');
        return lines;
      },
      choices: function () { return [
        { label: 'Try again', next: 'bridge' },
        { label: 'Exit', next: '_quit' }
      ]; }
    },
    drift_end: {
      text: function (s) {
        var lines = [
          '',
          'You sit in the captain\'s chair and watch the stars.',
        ];
        if (s.parrot) {
          lines.push('The parrot settles on your shoulder.');
        }
        lines.push('');
        lines.push('The ship drifts through the dark.');
        lines.push('The stars are beautiful.');
        lines.push('');
        lines.push('<span class="c-dim">Maybe that\'s enough.</span>');
        lines.push('');
        lines.push('<span class="c-head">                  THE END</span>');
        return lines;
      },
      choices: function () { return [
        { label: 'Play again', next: '_restart' },
        { label: 'Exit', next: '_quit' }
      ]; }
    },
    alone_end: {
      text: function () { return [
        '',
        'You sit in the dark server room.',
        'The racks hum. The parrot is gone.',
        '',
        '<span class="c-dim">Nobody comes.</span>',
        '',
        '<span class="c-dim">Eventually, even the LEDs stop blinking.</span>',
        '',
        '<span class="c-head">                  THE END</span>',
      ]; },
      choices: function () { return [
        { label: 'Play again', next: '_restart' },
        { label: 'Exit', next: '_quit' }
      ]; }
    }
  };

  cmds.adventure = function () {
    print('<span class="c-ok">Loading adventure...</span>');
    setTimeout(startAdventure, 400);
  };

  function startAdventure() {
    var state = { parrot: false, logs: false };
    var currentChoices = [];

    inputLine.classList.add('hidden');
    commandInput.blur();
    output.innerHTML = '';

    function showScene(id) {
      if (id === '_quit') return quit();
      if (id === '_restart') {
        state = { parrot: false, logs: false };
        output.innerHTML = '';
        showScene('start');
        return;
      }

      var scene = advScenes[id];
      var lines = scene.text(state);
      currentChoices = scene.choices ? scene.choices(state) : [];

      for (var i = 0; i < lines.length; i++) {
        var el = document.createElement('div');
        el.className = 'line';
        el.innerHTML = lines[i] || '&nbsp;';
        output.appendChild(el);
      }

      if (currentChoices.length > 0) {
        var spacer = document.createElement('div');
        spacer.className = 'line';
        spacer.innerHTML = '&nbsp;';
        output.appendChild(spacer);

        for (var j = 0; j < currentChoices.length; j++) {
          var cel = document.createElement('div');
          cel.className = 'line';
          cel.innerHTML = '  <span class="c-label">[' + (j + 1) + ']</span> ' + currentChoices[j].label;
          output.appendChild(cel);
        }
      }

      scrollBottom();
    }

    function onKey(e) {
      var num = parseInt(e.key);
      if (num >= 1 && num <= currentChoices.length) {
        e.preventDefault();
        var choice = currentChoices[num - 1];
        if (choice.fx === 'parrot') state.parrot = true;
        if (choice.fx === 'logs') state.logs = true;
        output.innerHTML = '';
        showScene(choice.next);
      } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
        e.preventDefault();
        quit();
      }
    }

    function quit() {
      document.removeEventListener('keydown', onKey);
      output.innerHTML = '';
      inputLine.classList.remove('hidden');
      focus();
    }

    document.addEventListener('keydown', onKey);
    showScene('start');
  }

  /* ── Execute ──────────────────────────────── */

  function execute(input) {
    var trimmed = input.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyPos = -1;
    tempInput = '';

    print(promptHTML() + esc(trimmed));

    var parts = trimmed.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');

    if (cmds[cmd]) {
      cmds[cmd](args);
    } else {
      print('<span class="c-err">command not found: ' + esc(cmd) + '</span>');
      print('<span class="c-dim">Type \'help\' for available commands.</span>');
    }
  }

  /* ── Tab completion ───────────────────────── */

  function tabComplete(partial) {
    if (!partial) return null;
    var lower = partial.toLowerCase();
    var matches = COMPLETABLE.filter(function (c) {
      return c.indexOf(lower) === 0;
    });
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      print(promptHTML() + esc(partial));
      print('<span class="c-dim">' + matches.join('  ') + '</span>');
    }
    return null;
  }

  /* ── Event listeners ──────────────────────── */

  commandInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      execute(this.value);
      this.value = '';
      scrollBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      if (historyPos === -1) {
        tempInput = this.value;
        historyPos = history.length - 1;
      } else if (historyPos > 0) {
        historyPos--;
      }
      this.value = history[historyPos];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPos === -1) return;
      if (historyPos < history.length - 1) {
        historyPos++;
        this.value = history[historyPos];
      } else {
        historyPos = -1;
        this.value = tempInput;
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      var completed = tabComplete(this.value);
      if (completed) this.value = completed;
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      cmds.clear();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      print(promptHTML() + esc(this.value) + '^C');
      this.value = '';
    }
  });

  terminal.addEventListener('click', function (e) {
    if (!e.target.closest('a')) {
      focus();
    }
  });

  /* ── Start ────────────────────────────────── */

  boot();
})();
