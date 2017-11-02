import React, { Component } from 'react'
import Slider from 'react-slick'

import Slide from './Slide'
import SlideButton from './SlideButton'

class OnBoardingSlider extends Component {
  render () {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      arrows: true,
      adaptiveHeight: true,
      nextArrow: <SlideButton onClick={this.props.onClick}>Next</SlideButton>,
      prevArrow: <SlideButton onClick={this.props.onClick}>Prev</SlideButton>
    }

    return (
      <div className='container' id='onboarding'>
        <Slider {...settings}>
          <div><Slide>1</Slide></div>
          <div><Slide>2</Slide></div>
          <div><Slide>3</Slide></div>
          <div>
            <Slide>
              <a
                className='btn'
                href='/auth/instagram'
              >
                Connect
              </a>
            </Slide>
          </div>
        </Slider>
      </div>
    )
  }
}

export default OnBoardingSlider
