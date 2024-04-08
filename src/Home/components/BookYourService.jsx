import React, { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import { image2svg } from '../../utilsfunctions/Svg';
import { urls } from '../../config/constants';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CommonApi, HomeApi } from '../../config/api';
import { defaultHeader, toastError, toastSuccess } from '../../services/CommonFunction';
import { callApi } from '../../services/ApiService';
import { commonRoutes, HomeRoutes, SuzukiRoutes } from '../../config/RouteConfig';
import MoveCursorToTop from '../../services/MoveCursorToTop';
import BookYourServiceForm from '../../HomeAR/components/Forms/BookYourServiceForm';

const BookYourService = () => {
  MoveCursorToTop();
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await callApi(CommonApi.getSettings.method, CommonApi.getSettings.url, null, null, defaultHeader());

      if (!res?.data?.error) {
        const payload = res?.data?.data;
        if (Array.isArray(payload) && payload?.length > 0) {
          for (let p of payload) {
            if (p?.key_name === 'book-service') {
              setData(p?.key_value);
            }
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
        if (Array.isArray(payload) && payload?.length > 0) {
          setData1(payload);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchData1();
    image2svg();
    AOS.init();
    AOS.refresh();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <section className="enquiry--block" style={{ backgroundImage: `url(${urls.dir_url}/${data})` }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="enquiry__form bg-white mt">
              <Slider {...settings}>
                {data1.map((d, i) => (d?.type === '1' && d?.pages === '4') ? (
                  <div key={i} className="hero__banner--img centered-img-wrapper responsive_wrapper" data-aos="fade-down" data-aos-duration="1300">
                    <img className="lazy-load centered-img responsive_img h-auto" src={`${urls.dir_url}/${d?.image}`} width="1920" height="940" alt="Hero Banner" />
                  </div>
                ) : null)}
              </Slider>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="enquiry__form bg-white">
              <div class="page__title mb-3" style={{ textAlign: "center" }}>
                <h2 class="h6 text-uppercase text-black mb-0" style={{ borderBottom: "2px solid #000000" }} >Service Offer</h2>
              </div>
              <BookYourServiceForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookYourService;
