function expect(): never {
  throw new Error('Expect failed');
}

function $(selector: string): HTMLElement {
  return document.querySelector(selector) || expect();
}

function _<Name extends keyof HTMLElementTagNameMap>(
    elementName: string, attributes: {[s: string]: string},
    ...children: Array<HTMLElement|string>): HTMLElementTagNameMap[Name] {
  const newElement = document.createElement(elementName);

  for (const key of Object.keys(attributes)) {
    newElement.setAttribute(key, attributes[key]);
  }

  for (const child of children) {
    if (child instanceof HTMLElement) {
      newElement.appendChild(child);
    } else {
      newElement.appendChild(document.createTextNode(child));
    }
  }

  return newElement;
}

interface Upgrade {
  name: string;

  purchased: boolean;

  price: number;

  onPurchase(): void;
}

interface Item {
  name: string;

  currentLevel: number;

  getPrice(currentLevel: number): number;

  onPurchase(currentLevel: number): void;
}

interface Milestone {
  amount: number;

  unlocked: boolean;

  callback(): void;
}

export class Game {
  private totalSleep = 0;
  private sleepButtonAmount = 1;
  private sleepPerSecond = 0;

  private availableUpgrades: Upgrade[] = [];
  private availableItems: Item[] = [];
  private milestones: Milestone[] = [];

  addUpgrade(name: string, price: number, onPurchase: () => void) {
    this.availableUpgrades.push({name, purchased: false, price, onPurchase});
  }

  addItem(
      name: string, getPrice: Item['getPrice'],
      onPurchase: Item['onPurchase']) {
    this.availableItems.push({name, currentLevel: 0, getPrice, onPurchase});
  }

  addMilestone(amount: number, callback: Milestone['callback']) {
    this.milestones.push({amount, callback, unlocked: false});
  }

  start() {
    $('#sleepButton').addEventListener('click', () => {
      this.addSleep(this.sleepButtonAmount);
      this.updateInterface();
    });

    this.addUpgrade('Better Sleep', this.timeToNumber(0, 0, 0, 0, 2, 0), () => {
      this.sleepButtonAmount = this.sleepButtonAmount * 10;
    });

    this.addMilestone(this.timeToNumber(0, 0, 0, 0, 15, 0), () => {
      this.addUpgrade(
          'Even Better Sleep', this.timeToNumber(0, 0, 0, 0, 30, 0), () => {
            this.sleepButtonAmount = this.sleepButtonAmount * 10;
          });
    });

    this.addMilestone(this.timeToNumber(0, 0, 0, 0, 30, 0), () => {
      this.addUpgrade(
          'Super Better Sleep', this.timeToNumber(0, 0, 0, 2, 0, 0), () => {
            this.sleepButtonAmount = this.sleepButtonAmount * 10;
          });
    });

    this.addMilestone(this.timeToNumber(0, 0, 1, 0, 0, 0), () => {
      this.addUpgrade(
          'Ultra Better Sleep', this.timeToNumber(0, 0, 2, 0, 0, 0), () => {
            this.sleepButtonAmount = this.sleepButtonAmount * 10;
          });
    });

    this.addMilestone(this.timeToNumber(0, 0, 4, 0, 0, 0), () => {
      this.addUpgrade(
          'Blood Sleep', this.timeToNumber(0, 1, 0, 0, 0, 0), () => {
            this.sleepButtonAmount = this.sleepButtonAmount * 20;
          });
    });

    this.addMilestone(this.timeToNumber(0, 10, 0, 0, 0, 0), () => {
      this.addUpgrade(
          'Never-Ending Sleep', this.timeToNumber(2, 0, 0, 0, 0, 0), () => {
            this.sleepButtonAmount = this.sleepButtonAmount * 5000;
          });
    });

    this.addItem(
        'Single Bed',
        (level) => {
          return Math.pow(2, level + 2);
        },
        (level) => {
          this.sleepPerSecond += 5;
        });

    this.addMilestone(this.timeToNumber(0, 0, 0, 0, 45, 0), () => {
      this.addItem(
          'Double Bed',
          (level) => {
            return Math.pow(5, level + 2);
          },
          (level) => {
            this.sleepPerSecond += 20;
          });
    });

    this.addMilestone(this.timeToNumber(0, 0, 0, 4, 0, 0), () => {
      this.addItem(
          'Queen Bed',
          (level) => {
            return Math.pow(10, level + 2);
          },
          (level) => {
            this.sleepPerSecond += 100;
          });
    });

    this.addMilestone(this.timeToNumber(0, 0, 1, 0, 0, 0), () => {
      this.addItem(
          'King Bed',
          (level) => {
            return Math.pow(20, level + 2);
          },
          (level) => {
            this.sleepPerSecond += 1000;
          });
    });

    this.addMilestone(this.timeToNumber(0, 1, 0, 0, 0, 0), () => {
      this.addItem(
          'Super King Bed',
          (level) => {
            return Math.pow(30, level + 2);
          },
          (level) => {
            this.sleepPerSecond += 5000;
          });
    });

    this.addMilestone(this.timeToNumber(100, 0, 0, 0, 0, 0), () => {
      this.addItem(
          'Sleep Castle',
          (level) => {
            return Math.pow(50, level + 5);
          },
          (level) => {
            this.sleepPerSecond += this.timeToNumber(2, 0, 0, 0, 0, 0);
          });
    });

    this.addMilestone(this.timeToNumber(1000, 0, 0, 0, 0, 0), () => {
      this.addItem(
          'Coffin',
          (level) => {
            return Math.pow(100, level + 5);
          },
          (level) => {
            $('#coffin').style.display = 'block';
            this.sleepPerSecond += this.timeToNumber(100, 0, 0, 0, 0, 0);
          });
    });

    setInterval(() => {
      this.addSleep(this.sleepPerSecond);

      this.updateInterface();
    }, 1000);

    this.updateInterface();
  }

  private tryUnlock() {
    for (const milestone of this.milestones) {
      if (milestone.unlocked) {
        continue;
      }

      if (milestone.amount > this.getMoney()) {
        continue;
      }

      milestone.callback();

      milestone.unlocked = true;
    }
  }

  private updateInterface() {
    $('#totalSleep').innerText = this.timeToString(this.totalSleep);
    $('#sleepPerSecond').innerText = this.timeToString(this.sleepPerSecond);
    $('#sleepButtonAmount').innerText =
        this.timeToString(this.sleepButtonAmount);

    this.tryUnlock();

    $('#itemContainer').innerHTML = '';

    for (const item of this.availableItems) {
      const currentPrice = item.getPrice(item.currentLevel);

      const upgradeButton =
          _('a', {
            'href': '#',
            'class': 'item-upgrade-button ' +
                (this.getMoney() > currentPrice ? 'button-enabled' :
                                                  'button-disabled')
          },
            'Upgrade Now');

      upgradeButton.addEventListener('click', () => {
        this.onUpgradeItem(item);
      });

      $('#itemContainer')
          .appendChild(
              _('div', {'class': 'item'},
                _('div', {'class': 'item-name'}, item.name),
                _('div', {'class': 'item-level'},
                  'Level: ', _('span', {}, item.currentLevel.toString(10))),
                _('div', {'class': 'item-price'}, 'Upgrade Price: ',
                  _('span', {}, this.priceToString(currentPrice))),
                _('div', {}, upgradeButton)));
    }

    $('#upgradeContainer').innerHTML = '';

    for (const upgrade of this.availableUpgrades) {
      if (upgrade.purchased) {
        $('#upgradeContainer')
            .appendChild(
                _('div', {'class': 'upgrade upgrade-purchased'},
                  _('div', {'class': 'upgrade-name'}, upgrade.name)));
      } else {
        const buyButton =
            _('a', {
              'href': '#',
              'class': 'upgrade-buy-button ' +
                  (this.getMoney() > upgrade.price ? 'button-enabled' :
                                                     'button-disabled')
            },
              'Buy Now');

        buyButton.addEventListener('click', () => {
          this.onBuyUpgrade(upgrade);
        });

        $('#upgradeContainer')
            .appendChild(_(
                'div', {'class': 'upgrade'},
                _('div', {'class': 'upgrade-name'}, upgrade.name),
                _('div', {'class': 'upgrade-price'},
                  'Price: ', _('span', {}, this.priceToString(upgrade.price))),
                _('div', {}, buyButton)));
      }
    }
  }

  private onBuyUpgrade(upgrade: Upgrade): boolean {
    if (this.getMoney() < upgrade.price) {
      return false;
    }

    upgrade.onPurchase();

    upgrade.purchased = true;

    this.updateInterface();

    return true;
  }

  private onUpgradeItem(item: Item): boolean {
    if (this.getMoney() < item.getPrice(item.currentLevel)) {
      return false;
    }

    item.currentLevel += 1;

    item.onPurchase(item.currentLevel);

    this.updateInterface();

    return true;
  }

  private getMoney() {
    return this.totalSleep;
  }

  private timeToNumber(
      years: number, weeks: number, days: number, hours: number,
      minutes: number, seconds: number) {
    return (52 * 7 * 24 * 60 * 60) * years + (7 * 24 * 60 * 60) * weeks +
        (24 * 60 * 60) * days + (60 * 60) * hours + (60) * minutes + seconds;
  }

  private timeToString(num: number) {
    let ret = '';

    const tiers: Array<[number, string]> = [
      [1000 * 1000 * 52 * 7 * 24 * 60 * 60, 'era'],
      [1000 * 52 * 7 * 24 * 60 * 60, 'eon'], [52 * 7 * 24 * 60 * 60, 'years'],
      [7 * 24 * 60 * 60, 'weeks'], [24 * 60 * 60, 'days'], [60 * 60, 'hours'],
      [60, 'minutes']
    ];

    for (const [tier, name] of tiers) {
      if (num > tier) {
        ret += `${(num / tier) | 0} ${name} `;
        num = num % tier;
      }
    }

    ret += `${num} seconds`;

    return ret;
  }

  private priceToString(num: number) {
    return this.timeToString(num);
  }

  private addSleep(num: number) {
    this.totalSleep += num;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  game.start();
});