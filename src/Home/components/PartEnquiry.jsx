import PartEnquiryForm from './Forms/PartEnquiryForm';
import React, { useState, useEffect, useCallback } from 'react';
import { CommonApi } from '../../config/api';
import { defaultHeader } from '../../services/CommonFunction';
import { urls } from '../../config/constants';
import { callApi } from '../../services/ApiService';
import MoveCursorToTop from '../../services/MoveCursorToTop';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PartEnquiry = () => {
  MoveCursorToTop();
  const [data, setData] = useState('');
  const [data1, setData1] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await callApi(CommonApi.getSettings.method, CommonApi.getSettings.url, null, null, defaultHeader());

      if (!res?.data?.error) {
        const payload = res?.data?.data;
        if (Array.isArray(payload) && payload?.length > 0) {
          const partsEnquiryData = payload.find(item => item?.key_name === 'parts-enquiry');
          if (partsEnquiryData) {
            setData(partsEnquiryData?.key_value);
            console.log(partsEnquiryData?.key_value);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchData1 = useCallback(async () => {
    try {
      const res = await callApi(CommonApi.getPageBanner.method, CommonApi.getPageBanner.url, null, null, defaultHeader());

      if (!res?.data?.error) {
        const payload = res?.data?.data;
        console.log(payload);
        if (Array.isArray(payload) && payload?.length > 0) {
          setData1(payload.filter(item => item?.type === '1' && item?.pages === '5'));
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchData1();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <section className="enquiry--block" style={{ backgroundImage: `url(${urls.dir_url}/${data})` }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="enquiry__form bg-white mt">
              <div className="car__model__slider">
                <Slider {...settings}>
                  {data1.map((d, i) =>
                    <div key={i}>
                      <div className="hero__banner--img centered-img-wrapper responsive_wrapper" data-aos="fade-down" data-aos-duration="1300">
                        <img className="lazy-load centered-img responsive_img" src={`${urls.dir_url}/${d?.image}`} width="1920" height="940" alt="Hero Banner" />
                      </div>
                    </div>
                  )}
                </Slider>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="enquiry__form bg-white">
              <div className="page__title mb-3" style={{ textAlign: "center" }}>
                <h2 className="h6 text-uppercase text-black mb-0" style={{ borderBottom: "2px solid #000000" }}>parts enquiry</h2>
              </div>
              <PartEnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartEnquiry;
