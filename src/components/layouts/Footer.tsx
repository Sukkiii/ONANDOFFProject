import { Logo } from '@/assets/images'

export default function Footer() {
  // 로그인 페이지나 채팅페이지에서는 안보이도록
  if (
    window.location.pathname === '/login' ||
    window.location.pathname === '/chat'
  )
    return null

  return (
    <footer className='bottom-0 flex justify-center w-full pt-8 pb-4 border-t border-light-gray-color bg-main-light-color'>
      <div className='w-3/4 transition-all duration-1000 desktop:w-8/12 max-w-common-screen-width'>
        <ul className='flex flex-col pb-4 text-sm text-left border-b gap-y-1 border-light-gray-color'>
          <li>
            <img
              className='w-[100px]'
              src={Logo}
              alt='온앤오프 기업 대표 로고'
            />
          </li>
          <li className='mt-6'>
            <a
              target='_blank'
              href='https://water-vulcanodon-65c.notion.site/73a58d0b9cac4d43a3ddba5cf7567c15?pvs=4'
            >
              <strong>개인정보처리방침</strong>
            </a>
            &nbsp; &#124; &nbsp;
            <a
              target='_blank'
              href='https://water-vulcanodon-65c.notion.site/1568078dfbad4bb2899df2b15c22e4ce?pvs=4'
              className='hover:underline'
            >
              이용약관
            </a>
          </li>
          <li className='mt-3 text-sm text-gray-900'>
            <small>(주) </small>온앤오프
          </li>
          <li className='text-xs text-gray-800'>
            대표자: 이준규 &nbsp;|&nbsp; 대표전화:
            <a href='tel:0904-1229' className='hover:underline'>
              0904-1229
            </a>
          </li>
          <li className='text-xs text-gray-800'>
            사업자등록번호:
            <span>317-25-89091</span>
          </li>
          <li className='text-xs text-gray-800'>
            이메일:
            <a href='mailto:onoffService@gmail.com' className='hover:underline'>
              onoffService@gmail.com
            </a>
          </li>
          <li className='text-xs text-gray-800'>
            찾아오시는 길: (06212)
            <a
              target='_blank'
              href='https://naver.me/Fcu63dOf'
              className='hover:underline'
            >
              서울 강남구 선릉로 433 세방빌딩 6층, 16층
            </a>
          </li>
          <li>
            <p className='text-gray-400'>
              copyright &copy; 2023 All rights reserved by ON&OFF.
            </p>
          </li>
        </ul>
        <p className='text-dark-gray-color text-[0.6rem] text-left break-keep'>
          온앤오프는 모임 중개기관으로 온앤오프 플랫폼을 통하여 방장과 모임
          참여자 사이에 이루어지는 모임의 당사자가 아닙니다. 온앤오프 플랫폼을
          통하여 예약된 일정, 장소, 방장 서비스에 관한 의무와 책임은 해당
          서비스를 제공하는 방장에게 있습니다.
        </p>
      </div>
    </footer>
  )
}
