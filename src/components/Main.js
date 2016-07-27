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
}(imageDatas));

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
      </figure>
    );
  }
}


class AppComponent extends React.Component {
  render() {
    var aControllerUnits = [],
      aFigures = [];

    imageDatas.forEach(function(value) {
      aFigures.push(<ImgFigure data={value} />);
    })

    return (
      <section className="stage">
        <section className="img-sec">
          {aFigures}
        </section>
        <nav className="controller-nav">
          {aControllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
