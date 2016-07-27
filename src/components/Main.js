require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('../data/imageDatas.json');

// 构建图片路径(执行一次所以用自执行函数)
imageDatas = (function(aImageDatas) {
  for (var i = 0, j = aImageDatas.length; i < j; i++) {
    var oImg = aImageDatas[i];
    oImg.imageURL = require('../images/' + oImg.fileName);
    aImageDatas[i] = oImg;
  }
  return aImageDatas;
}(imageDatas))

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
