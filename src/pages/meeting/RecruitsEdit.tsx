import { useState, useEffect, ChangeEvent } from 'react'
import {
  fetchGetRecruitEvents,
  // , fetchPostRecruitEditEvents
} from '@/api/event'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { GoPlus } from 'react-icons/go'
import { IoClose } from 'react-icons/io5'
import { CiCalendar } from 'react-icons/ci'
import dayjs from 'dayjs'
import {
  RadioButtons,
  Button,
  SelectBox,
  Inputs,
  TextArea,
} from '@/components/common/index'
import {
  RecruitsCheckBox,
  RecruitsTitle,
  RecruitsDayPick,
  RecruitsAddress,
  RecruitsCategory,
  RecruitsCareerCategory,
  RecruitsSubCategory1,
  RecruitsSubCategory2,
} from '@/components/meeting/index'
import InputHash from '@/components/meeting/mypage/InputHash'

interface FormData {
  categoryId: number
  subCategoryId: number
  careerCategoryId: number[]
  hashTag: string[]
  image: File
  showImage: string
  title: string
  content: string
  recruitment: number
  question: string
  online: number
  challengeStartDate: Date
  challengeEndDate: Date | null
  address: {
    zipCode: number
    detail1: string
    detail2: string
    latitude: number
    longitude: number
  }
}

// interface RecruitsEditProps {
//   eventId: number
// }
export default function RecruitsEdit() {
  // { eventId }: RecruitsEditProps
  const eventId = 16
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      hashTag: [],
      challengeStartDate: new Date(),
    },
  })

  const navigate = useNavigate()
  const [showDayPick, setShowDayPick] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedOnLine, setSelectedOnLine] = useState<number | null>(null)
  const [selectedCareerCategoryId, setSelectedCareerCategoryId] = useState<
    number[]
  >([])
  // const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
  // null,
  // )
  const [myImage, setMyImage] = useState<File | null>(null)
  const [dataArray, setDataArray] = useState<string[]>([])
  const currentStartDate = dayjs(watch('challengeStartDate')).format(
    'YYYY-MM-DD',
  )
  const currentEndDate = dayjs(watch('challengeEndDate')).format('YYYY-MM-DD')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recruitGetEvents = await fetchGetRecruitEvents(eventId)
        console.log(recruitGetEvents)
        if (recruitGetEvents) {
          setValue('categoryId', recruitGetEvents.category.parentId!.id)
          setSelectedCategory(recruitGetEvents.category.parentId!.id)
          setValue('subCategoryId', recruitGetEvents.category.id)
          // setSelectedSubCategory(recruitGetEvents.category.id)
          const careerCategoryIds = recruitGetEvents.careerCategories.map(
            (category: { id: number }) => category.id,
          )

          setValue('careerCategoryId', careerCategoryIds)
          setSelectedCareerCategoryId(careerCategoryIds)
          const hashTags = recruitGetEvents.hashTags.map(
            (hashTag: { hashtag: string }) => hashTag.hashtag,
          )

          setValue('hashTag', hashTags)
          setDataArray(hashTags)
          setValue('showImage', recruitGetEvents.image.uploadPath)
          setValue('title', recruitGetEvents.title)
          setValue('content', recruitGetEvents.content)
          setValue('recruitment', recruitGetEvents.recruitment)
          setValue('question', recruitGetEvents.question)
          setValue('online', recruitGetEvents.online)
          setSelectedOnLine(recruitGetEvents.online)

          if (recruitGetEvents.challengeStartDate) {
            const challengeStartDate = new Date(
              recruitGetEvents.challengeStartDate,
            )
            setValue('challengeStartDate', challengeStartDate)
          }
          if (recruitGetEvents.challengeEndDate) {
            const challengeEndDate = new Date(recruitGetEvents.challengeEndDate)
            setValue('challengeEndDate', challengeEndDate)
          }
          setValue('address.zipCode', recruitGetEvents.address.zipCode)
          setValue('address.detail1', recruitGetEvents.address.detail1)
          setValue('address.detail2', recruitGetEvents.address.detail2)
          setValue('address.latitude', recruitGetEvents.address.latitude)
          setValue('address.longitude', recruitGetEvents.address.longitude)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [eventId, setValue])
  const onSubmit: SubmitHandler<FormData> = async (data, event) => {
    if (event) {
      event.preventDefault()
    }

    const formData = new FormData()
    formData.append('categoryId', data.categoryId.toString())
    formData.append('subCategoryId', data.subCategoryId.toString())
    formData.append('careerCategoryId', data.careerCategoryId.toString())
    formData.append('hashTag', data.hashTag.toString())
    formData.append('image', data.image)
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('recruitment', data.recruitment.toString())
    formData.append('question', data.question)
    formData.append('online', data.online.toString())
    formData.append('challengeStartDate', data.challengeStartDate.toISOString())
    if (data.challengeEndDate) {
      formData.append('challengeEndDate', data.challengeEndDate.toISOString())
    } else {
      formData.append('challengeEndDate', '')
    }
    formData.append('address', JSON.stringify(data.address))

    // try {
    //   await fetchPostRecruitEditEvents(formData)
    //   console.log('formData', formData)
    //   console.log('FormData', data)
    // } catch (error) {
    //   console.error('Error:', error)
    // }
    console.log('FormData', data)
  }

  const handleButtonClick = () => {
    navigate(-1)
  }

  const REQUIRED_MESSAGE = '*필수로 입력해주세요.'

  const getErrorMessage = (field: keyof FormData) => {
    return errors[field] ? (
      <p className='block mt-2 text-red-500 text-size-subbody'>
        {errors[field]?.message}
      </p>
    ) : null
  }

  const handleDateChange = (date: Date) => {
    setValue('challengeStartDate', date)
    setShowDayPick(false)
  }

  const handleEndDateChange = (date: Date) => {
    setValue('challengeEndDate', date)
    setShowDayPick(false)
  }

  const handleDayPickClick = () => {
    setShowDayPick(!showDayPick)
  }
  // TODO: 다른 공간 누르면 dayPick 창 닫히게 하기

  const handleCategoryChange = (value: number) => {
    if (!selectedCategory) {
      setSelectedCategory(value)
    }
  }

  const handleOnLineChange = (value: number) => {
    if (!selectedOnLine) {
      setSelectedOnLine(value)
    }
  }

  const handleValueClick = (value: number) => {
    setValue('subCategoryId', value)
  }

  const handleAddress = (data: {
    zonecode: string
    address: string
    roadAddress: string
  }) => {
    setValue('address.zipCode', Number(data.zonecode))
    setValue('address.detail1', data.address)

    const geocoder = new kakao.maps.services.Geocoder()
    geocoder.addressSearch(data.roadAddress, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setValue('address.latitude', Number(result[0].y))
        setValue('address.longitude', Number(result[0].y))
      }
    })
  }

  const handleAddress2 = (address2: string) => {
    setValue('address.detail2', address2)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setMyImage(selectedFile || null)
  }

  const onImageDelete = () => {
    setMyImage(null)
    // TODO: image 다시 등록할 때 버그 생기는 것 없애기
    // setValue('image')
    // 이미지 업로드 버튼으로 새로 이미지를 넣으면 reset이 되지만, (이미지 삭제버튼 안누르고)
    // 현재 버그있음 > 이미지를 삭제 버튼을 누르면 undefined로 고정이 되어버림.
    // 그렇다고, 그냥 이미지를 안보이게 하면, 다른 이미지로 바꿔도 처음 클릭했던 이미지가 들어감
  }

  // 해시태그 추가 로직
  const handleEnter = (value: string) => {
    if (value.trim() !== '') {
      if (!dataArray.includes(value.trim())) {
        if (dataArray.length < 10) {
          setDataArray((prevArray) => [...prevArray, value.trim()])
          setValue('hashTag', [...dataArray, value.trim()])
        } else {
          alert('태그는 10개까지만 입력할 수 있습니다.')
        }
      } else {
        console.log('이미 존재하는 값입니다.')
      }
    }
  }

  const handleRemoveHash = (index: number) => {
    setDataArray((prevArray) => prevArray.filter((_, i) => i !== index))
    setValue(
      'hashTag',
      dataArray.filter((_, i) => i !== index),
    )
  }

  const category = RecruitsCategory()
  const careerCategoryId = RecruitsCareerCategory()
  const subCategoryId1 = RecruitsSubCategory1()
  const subCategoryId2 = RecruitsSubCategory2()

  const online = [
    { text: '온라인', value: 1 },
    { text: '오프라인', value: 0 },
  ]

  return (
    <>
      <div className='mx-auto my-20'>
        <div className='flex justify-center mx-auto font-bold text-size-title'>
          나만의 모임 생성
        </div>
        <form className='flex flex-col gap-16 my-20'>
          <div className='flex'>
            <RecruitsTitle>카테고리 설정</RecruitsTitle>
            <div className='flex flex-col cursor-pointer'>
              <RadioButtons
                data={category}
                name='category'
                clickChange={handleCategoryChange}
                selectedValue={selectedCategory}
                disabled={!!selectedCategory}
              />
              {getErrorMessage('categoryId')}
            </div>
          </div>
          {selectedCategory === 2 && (
            <div className='flex'>
              <RecruitsTitle>챌린지 기간</RecruitsTitle>
              <div className='flex gap-3'>
                <div>
                  <div
                    className='flex p-2.5 px-3 border-2 rounded-md cursor-pointer'
                    onClick={handleDayPickClick}
                  >
                    <CiCalendar />
                    {currentStartDate}
                  </div>
                  {showDayPick && (
                    <RecruitsDayPick onDayClick={handleDateChange} />
                  )}
                </div>
                <p className='pt-2 font-bold'>~</p>
                <div>
                  <div
                    className='flex p-2.5 px-3 border-2 rounded-md cursor-pointer '
                    onClick={handleDayPickClick}
                  >
                    <CiCalendar />
                    {currentEndDate}
                  </div>
                  {showDayPick && (
                    <RecruitsDayPick onDayClick={handleEndDateChange} />
                  )}
                </div>
              </div>
            </div>
          )}
          {selectedCategory !== 2 && (
            <div className='flex'>
              <RecruitsTitle>모임 시작일</RecruitsTitle>
              <div>
                <div
                  className='flex items-center gap-1 p-2.5 px-3 border-2 rounded-md cursor-pointer w-fit'
                  onClick={handleDayPickClick}
                >
                  <CiCalendar />
                  {currentStartDate}
                </div>
                {showDayPick && (
                  <RecruitsDayPick onDayClick={handleDateChange} />
                )}
              </div>
            </div>
          )}
          <div className='flex'>
            <RecruitsTitle>세부 카테고리</RecruitsTitle>
            {selectedCategory !== 2 && (
              <SelectBox
                bgColor='white'
                textSize='size-body'
                options={subCategoryId1}
                register={register('subCategoryId', { required: true })}
                onClick={handleValueClick}
              />
            )}
            {selectedCategory === 2 && (
              <SelectBox
                bgColor='white'
                textSize='size-body'
                options={subCategoryId2}
                register={register('subCategoryId', { required: true })}
                onClick={handleValueClick}
              />
            )}
            {getErrorMessage('subCategoryId')}
          </div>
          <div className='flex'>
            <RecruitsTitle>모집 대상</RecruitsTitle>
            <div className='flex flex-col'>
              <RecruitsCheckBox
                options={careerCategoryId}
                name='careerCategoryId'
                onChange={(selectedValues) => {
                  setValue('careerCategoryId', selectedValues)
                }}
                selectedValues={selectedCareerCategoryId}
              />
              {getErrorMessage('careerCategoryId')}
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>모집 제목 글</RecruitsTitle>
            <div className='flex flex-col w-1/2'>
              <Inputs
                width='w-3/4'
                register={register('title', {
                  required: REQUIRED_MESSAGE,
                })}
              />
              {getErrorMessage('title')}
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>모집 내용 글</RecruitsTitle>
            <div className='flex flex-col w-1/2'>
              <TextArea
                placeholder='모집에 대한 설명을 작성해주세요'
                width='w-full'
                height='h-40'
                register={register('content', {
                  required: REQUIRED_MESSAGE,
                })}
              />
              {getErrorMessage('content')}
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>모집 할 인원</RecruitsTitle>
            <div className='flex flex-col'>
              <div className='flex items-end gap-3'>
                <Inputs
                  width='w-12'
                  type='number'
                  register={register('recruitment', {
                    valueAsNumber: true,
                    required: '*숫자만 입력해주세요.',
                  })}
                />
                <p className='mb-1 text-text-subbody text-dark-gray-color'>
                  명
                </p>
              </div>
              {getErrorMessage('recruitment')}
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>만남 유형</RecruitsTitle>
            <div>
              <RadioButtons
                data={online}
                name='online'
                clickChange={handleOnLineChange}
                selectedValue={selectedOnLine}
                disabled={!!selectedOnLine}
              />
              {getErrorMessage('online')}
            </div>
          </div>
          {selectedOnLine !== 1 && (
            <div className='flex'>
              <RecruitsTitle>오프라인 장소</RecruitsTitle>
              <div className='flex flex-col w-1/2'>
                <div className='flex flex-wrap justify-between gap-5'>
                  <RecruitsAddress
                    onComplete={handleAddress}
                    onChange={handleAddress2}
                    address={watch('address')}
                  />
                  {getErrorMessage('address')}
                </div>
              </div>
            </div>
          )}
          <div className='flex'>
            <RecruitsTitle>대표이미지 업로드</RecruitsTitle>
            <div className='flex flex-col gap-2'>
              <div className='flex gap-3'>
                <input
                  id='picture'
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={(e) => {
                    handleFileChange(e)
                    const file = e.target.files?.[0]
                    register('image', { value: file })
                  }}
                />
                <div
                  className='flex border-2 cursor-pointer border-light-gray-color rounded-image-radius w-36 h-36'
                  onClick={() => document.getElementById('picture')?.click()}
                >
                  <GoPlus className='w-10 h-10 m-auto fill-light-gray-color' />
                </div>
                {myImage ? (
                  <div className='relative'>
                    <div className='relative flex overflow-hidden border-2 cursor-pointer border-light-gray-color rounded-image-radius w-36 h-36'>
                      <img
                        className='w-full h-full'
                        src={URL.createObjectURL(myImage)}
                      />
                    </div>
                    <div
                      className='absolute top-[-7px] right-[-7px] z-10 cursor-pointer'
                      onClick={onImageDelete}
                    >
                      <IoClose className='w-6 h-6 bg-white border-2 rounded-full fill-main-color border-main-color' />
                    </div>
                  </div>
                ) : null}
                {getErrorMessage('image')}
              </div>
              <div className='mt-3 text-size-subbody text-sub-color'>
                사진은 한 장 만 등록됩니다. <br />
                권장 크기: 360*360 이상, 정방형으로 사진이 등록됨을 유의하시길
                바랍니다. <br />
                jpg, jpeg, png 형식의 이미지만 등록 가능합니다.
              </div>
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>해시태그</RecruitsTitle>
            <div className='flex flex-col'>
              <InputHash
                placeholder='#태그입력'
                width='w-80'
                onEnter={(value) => handleEnter(value)}
                register={register('hashTag')}
              />
              <div>
                <ul className='flex max-w-[550px] w-full flex-wrap gap-3 mt-3'>
                  {dataArray.map((item, index) => (
                    <li
                      className='p-1 px-3 my-1 rounded-md bg-main-light-color w-fit text-subbody text-black-color'
                      key={index}
                    >
                      #{item}{' '}
                      <span
                        onClick={() => handleRemoveHash(index)}
                        className='cursor-pointer'
                      >
                        ⤫
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='flex'>
            <RecruitsTitle>신청모집 질문 글</RecruitsTitle>
            <div className='flex flex-col w-1/2'>
              <TextArea
                placeholder='모집에 대한 질문을 작성해주세요. &#13;&#10;(Ex. 개발 경험, MBTI, 싫어하는 스터디원 유형 등)'
                width='w-full'
                height='h-40'
                register={register('question', {
                  required: REQUIRED_MESSAGE,
                })}
              />
              {getErrorMessage('question')}
              <div className='mt-3 text-size-subbody text-sub-color'>
                모임에 가입을 신청한 분에게 궁금한 점을 남겨주세요.
                <br />
                해당 모임 가입 요청 시, 유저가 답변하게 될 질문 글입니다.
                <br />
                모임과 무관하거나 사생활 등 민감한 질문은 피해주시길 바랍니다.
                <br />본 질문은 추후에 수정이 불가하니 신중하게 작성 바랍니다.
              </div>
            </div>
          </div>
        </form>
        <div className='flex justify-center gap-10 m-2'>
          <Button onClick={handleButtonClick} fill='inactiveFill' type='submit'>
            취소
          </Button>
          <Button onClick={handleSubmit(onSubmit)} fill='activeFill'>
            수정하기
          </Button>
        </div>
      </div>
    </>
  )
}
