import fs from 'fs';
import fetch from 'node-fetch';

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  fg: {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
  }
};

const tembak = (token) => {
  return new Promise((resolve, reject) => {
    const randomtap = Math.floor(Math.random() * 50) + 50;
    fetch('https://api.tapswap.ai/api/player/submit_taps', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'x-app': 'tapswap_server',
        'Content-Id': '27904',
        'x-cv': '1',
        Origin: 'https://app.tapswap.club',
        'X-Requested-With': 'org.telegram.messenger',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        Referer: 'https://app.tapswap.club/',
        'Accept-Language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        taps: randomtap,
        time: new Date().getTime() - 10000,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const login = (hash) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.tapswap.ai/api/account/login', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        'x-app': 'tapswap_server',
        'x-cv': '1',
        Origin: 'https://app.tapswap.club',
        'X-Requested-With': 'org.telegram.messenger',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        Referer: 'https://app.tapswap.club/',
        'Accept-Language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        init_data: hash,
        referrer: '',
        bot_key: 'app_bot_0',
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const applyboost = (token, type) => {
  return new Promise((resolve, reject) => {
    fetch('https://api.tapswap.ai/api/player/apply_boost', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        'x-app': 'tapswap_server',
        'x-cv': '1',
        Origin: 'https://app.tapswap.club',
        'X-Requested-With': 'org.telegram.messenger',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        Referer: 'https://app.tapswap.club/',
        'Accept-Language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        type: type,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          reject(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const displayBalanceTable = (balanceTable) => {
  console.log(`${colors.bright}${colors.fg.green}Balance Table${colors.reset}`);
  console.log(`${colors.bright}${colors.fg.cyan}--------------------------------${colors.reset}`);
  balanceTable.forEach((account, index) => {
    console.log(
      `${colors.fg.yellow}${index + 1}. ${account.name}: ${colors.fg.cyan}Shares: ${account.shares}, Energy: ${account.energy}${colors.reset}`
    );
  });
  console.log(`${colors.bright}${colors.fg.cyan}--------------------------------${colors.reset}`);
};

const main = async () => {
  console.clear();
  const hashlist = fs.readFileSync('hash.txt', 'utf8').trim().split('\n');
  const balanceTable = [];
  console.log(
    `${colors.fg.green}[ ${new Date().toLocaleString()} ] Total akun yang akan dijalankan: ${hashlist.length}${colors.reset}`
  );
  while (true) {
    for (let i = 0; i < hashlist.length; i++) {
      console.log(
        `\n${colors.fg.green}[ ${new Date().toLocaleString()} ] Sedang login akun ke ${i + 1} dari ${hashlist.length}${colors.reset}`
      );
      const hash = hashlist[i].trim();
      const result = await login(hash).catch((err) => {
        console.error(`${colors.fg.red}[ ${new Date().toLocaleString()} ] Login error: ${colors.reset}`, err);
        return err;
      });
      let token = result?.access_token;
      if (token) {
        console.log(
          `${colors.fg.green}[ ${new Date().toLocaleString()} ] Berhasil login, akun ${result.player.full_name}${colors.reset}`
        );
        while (true) {
          try {
            const resulttembak = await tembak(token).catch((err) => {
              console.error(`${colors.fg.red}[ ${new Date().toLocaleString()} ] Tembak error: ${colors.reset}`, err);
              return err;
            });
            if (!resulttembak?.player?.energy) {
              const reloginres = await login(hash).catch((err) => {
                console.error(`${colors.fg.red}[ ${new Date().toLocaleString()} ] Relogin error: ${colors.reset}`, err);
                return err;
              });
              token = reloginres?.access_token;
              continue;
            }
            console.log(`${colors.fg.cyan}[ ${new Date().toLocaleString()} ] Energi tinggal ${resulttembak?.player?.energy}${colors.reset}`);
            console.log(`${colors.fg.cyan}[ ${new Date().toLocaleString()} ] Balance ${resulttembak.player.shares}${colors.reset}`);

            // Update balance table
            const accountIndex = balanceTable.findIndex(acc => acc.name === result.player.full_name);
            if (accountIndex === -1) {
              balanceTable.push({
                name: result.player.full_name,
                shares: resulttembak.player.shares,
                energy: resulttembak.player.energy
              });
            } else {
              balanceTable[accountIndex].shares = resulttembak.player.shares;
              balanceTable[accountIndex].energy = resulttembak.player.energy;
            }

            displayBalanceTable(balanceTable);

            if (resulttembak?.player?.energy <= 100) {
              console.log(
                `${colors.fg.red}[ ${new Date().toLocaleString()} ] Energi tinggal ${resulttembak.player.energy}${colors.reset}`
              );
              break;
            } else {
              const delay = 200;
              console.log(
                `${colors.fg.blue}[ ${new Date().toLocaleString()} ] Delay ${delay} ms${colors.reset}`
              );
              await new Promise((r) => setTimeout(r, delay));
            }
          } catch (err) {
            console.error(`${colors.fg.red}[ ${new Date().toLocaleString()} ] Error: ${colors.reset}`, err);
            process.exit(1);
          }
        }
      } else {
        console.error(`${colors.fg.red}[ ${new Date().toLocaleString()} ] Error: Failed to retrieve token${colors.reset}`);
      }
    }
  }
};

main();
