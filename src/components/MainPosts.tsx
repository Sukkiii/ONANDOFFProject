import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Button } from '@/components/common'
import { PostsProps } from '@/types'
import { IoIosArrowBack } from 'react-icons/io'

import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/bundle'

import swipercore from 'swiper'
swipercore.use([Autoplay])

export default function MainPosts({ title, data, isSlide }: PostsProps) {
  const navigate = useNavigate()
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)

  // const items = isSlide ? data : data.slice(0, 3)
  const items = data

  const swiperRef = useRef<swipercore>()

  // 호버 시, 슬라이드 정지
  const handleMouseEnter = () => {
    if (swiperRef.current) swiperRef.current.autoplay?.stop()
  }

  const handleMouseLeave = () => {
    if (swiperRef.current) swiperRef.current.autoplay?.start()
  }

  // 이전, 다음 버튼 이벤트핸들러
  const handlePrev = () => {
    swiper?.slidePrev()
  }
  const handleNext = () => {
    swiper?.slideNext()
  }
  console.log(items)
  const handleClickCategory = (categoryId: number | undefined) => {
    if (categoryId !== undefined) {
      navigate(`/meetup-lists/${categoryId}`)
    }
  }

  return (
    <section className='relative flex flex-col gap-y-7'>
      <h2 className='font-bold text-size-title break-keep'>{title}</h2>
      {isSlide ? (
        <>
          <div className='relative'>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Swiper
                className='pt-1'
                loop={items.length > 1}
                speed={2000}
                slideToClickedSlide={true}
                loopedSlides={2}
                slidesPerView={3}
                spaceBetween={30}
                watchOverflow={true}
                slidesOffsetBefore={0}
                autoplay={{
                  delay: 1000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                navigation={{
                  prevEl: '#prev_slide',
                  nextEl: '#next_slide',
                }}
                onSwiper={(e) => {
                  setSwiper(e)
                  swiperRef.current = e
                }}
              >
                {items.map((item) => (
                  <SwiperSlide key={item.id}>
                    <Card data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* 이전, 다음 버튼 커스텀 */}
            <button
              className='absolute top-1/2 -left-[50px]'
              onClick={handlePrev}
            >
              <i className='text-size-title tablet:text-[2rem] text-black-color'>
                <IoIosArrowBack />
              </i>
            </button>
            <button
              className='absolute top-1/2 -right-[50px]'
              onClick={handleNext}
            >
              <i className='text-size-title tablet:text-[2rem] text-black-color'>
                <IoIosArrowBack className='rotate-180' />
              </i>
            </button>
          </div>

          <div className='pt-2 text-right text-size-subbody'>
            <Button
              fill='border'
              onClick={() =>
                handleClickCategory(data[0]?.category?.parentId?.id)
              }
            >
              전체보기
            </Button>
          </div>
        </>
      ) : (
        <div className='grid grid-cols-3 gap-4'>
          {items.map((item) => (
            <Card key={item.id} data={item} />
          ))}
        </div>
      )}
    </section>
  )
}
