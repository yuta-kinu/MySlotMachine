'use strict';

{
  class Panel {
    // インスタンスが生成されると同時に呼び出される
    constructor() {
      // sectionを作ってpanelクラスを付ける
      const section = document.createElement('section');
      section.classList.add('panel');

      // imgタグを作る
      this.img = document.createElement('img');
      // ページを更新するたびに画像を切り替える
      this.img.src = this.getRandomImage();

      this.timeoutId = undefined;

      // divを作って、テキストをSTOPにする
      this.stop = document.createElement('div');
      this.stop.textContent = 'STOP';
      // spinを押す前にstopが押せないようにinactiveにする
      this.stop.classList.add('stop', 'inactive');
      this.stop.addEventListener('click', () => {
        // この条件分岐がないと同じボタンを3回押すと結果判定に移ってしまう
        if (this.stop.classList.contains('inactive')) {
          return;
        }
        this.stop.classList.add('inactive');

        // setTimeoutを止める
        clearTimeout(this.timeoutId);

        // stopするたびに残っているパネルは減る
        panelsLeft--;

        // パネルが0枚になったら結果を判定する
        if (panelsLeft === 0) {
          checkResult();
          // 結果判定した後にspinを押せるようにする
          spin.classList.remove('inactive');
          panelsLeft = 5;
        }
      });

      // imgとstopをsectionの子要素に追加
      section.appendChild(this.img);
      section.appendChild(this.stop);

      // sectionをmainの子要素に追加
      const main = document.querySelector('main');
      main.appendChild(section);
    }

    // img内の画像をランダムにする関数
    getRandomImage() {
      const images = [
        'img/seven.png',
        'img/bell.png',
        'img/cherry.png',
      ];
      return images[Math.floor(Math.random() * images.length)];
    }

    spin() {
      // this.img.srcをランダムな画像のファイル名にする
      this.img.src = this.getRandomImage();

      // 一定時間ごとにspin()が呼び出されるようにする
      this.timeoutId = setTimeout(() => {
        this.spin();
      }, 50);
    }

    isUnmatched(p1, p2, p3, p4) {
      // imgのsrcが他のimgのsrcと異なっていたらtrueを返す
      return this.img.src !== p1.img.src && this.img.src !== p2.img.src && this.img.src !== p3.img.src && this.img.src !== p4.img.src
    }

    // 他のパネルとマッチしなかったらunmatchedクラスをつけて色を変える関数
    unmatch() {
      this.img.classList.add('unmatched');
    }

    // unmatchedクラスを外して、stopを押せるようにする
    activate() {
      this.img.classList.remove('unmatched');
      this.stop.classList.remove('inactive');
    }
  }

  // パネルがマッチしたかどうかを判定する関数
  function checkResult() {
    if (panels[0].isUnmatched(panels[1], panels[2], panels[3], panels[4])) {
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0], panels[2], panels[3], panels[4])) {
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[0], panels[1], panels[3], panels[4])) {
      panels[2].unmatch();
    }
    if (panels[3].isUnmatched(panels[0], panels[1], panels[2], panels[4])) {
      panels[3].unmatch();
    }
    if (panels[4].isUnmatched(panels[0], panels[1], panels[2], panels[3])) {
      panels[4].unmatch();
    }
  }

  // 5つインスタンスを作ってパネルを5枚作る
  const panels = [
    new Panel(),
    new Panel(),
    new Panel(),
    new Panel(),
    new Panel(),
  ];

  // あと何枚パネルが残っているか表す関数
  let panelsLeft = 5;

  const spin = document.getElementById('spin');
  // spinを押したら呼び出される処理
  spin.addEventListener('click', () => {
    // spinを押したら続けては押せないようにする
    // inactiveが付いているときはそれ以降の処理はしない
    if (spin.classList.contains('inactive')) {
      return;
    }
    spin.classList.add('inactive');

    panels.forEach(panel => {
      // 結果判定後にpanelのunmatchedを外す
      panel.activate();

      panel.spin();
    });
  });
}
