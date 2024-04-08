import React, { useState, useEffect, useCallback } from 'react';
import AOS from 'aos';
import { image2svg } from '../../utilsfunctions/Svg';
import { urls } from '../../config/constants';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper';
import { CommonApi } from '../../config/api';
import { callApi } from '../../services/ApiService';
import { defaultHeader } from '../../services/CommonFunction';
import Slider from 'react-slick';

const BmEpp = () => {
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const res = await callApi(CommonApi.getPageBanner.method, CommonApi.getPageBanner.url, null, null, defaultHeader());

      if (!res?.data?.error) {
        const payload = res?.data?.data;
        console.log(payload);
        if (Array.isArray(payload) && payload?.length > 0) {
          setData(payload);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchData1 = useCallback(async () => {
    await callApi(CommonApi.getSettings.method, CommonApi.getSettings.url, null, null, defaultHeader()).then((res) => {
      if (!res?.data?.error) {
        const arr = [];
        const payload = res?.data?.data;
        if (Array.isArray(payload) && payload?.length > 0) {
          for (let p of payload) {
            if (p?.key_name === 'suzuki-bmepp') {
              setData1(p?.key_value);
              console.log(p?.key_value);
            }
            if (p?.key_name === 'bmepp-content') {
              setData2(p?.key_value);
              console.log(p?.key_value);
            }
          }
        }
      } else {
        // toastError(res?.data?.message);
      }
    }).catch((err) => {
      // toastError(err?.response?.data?.message);
    })
  }, []);

  useEffect(() => {
    fetchData();
    fetchData1();
    image2svg();
    AOS.init();
    AOS.refresh();
  }, []);

  const settings = {
    autoplay: true,
    autoplaySpeed: 2500,
    fade: true,
    pauseOnHover: false,
    dots: true,
  };

  return (
    <>
      <section className="enquiry--block" style={{ backgroundImage: `url(${urls.dir_url}/${data1})` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="enquiry__form bg-white">
                <div className="car__model__slider swiper">
                  <Slider {...settings}>
                    {data.map((d, i) => (d?.type === '2' && d?.pages === '1') ?
                      (
                        <div className="hero__banner--img centered-img-wrapper" data-aos="fade-down" data-aos-duration="1300">
                          <img className="lazy-load centered-img" src={`${urls.dir_url}/${d?.image}`} width="1920" height="940" alt="Hero Banner" />
                        </div>
                      ) : null)}
                  </Slider>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="enquiry__form bg-white">
                <div class="page__title mb-3" style={{ textAlign: "center" }}>
                  <h2 className="h6 text-uppercase text-black mb-0" style={{ borderBottom: "2px solid #000000" }}>BM EPP</h2>
                </div>
                <span dangerouslySetInnerHTML={{ __html: data2 }}></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default BmEpp;