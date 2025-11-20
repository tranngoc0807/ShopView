import Image from 'next/image';

export default function HeroBanner() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://pos.nvncdn.com/fa2431-2286/bn/20251003_0ffK1slx.gif?v=1759481285)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <div className="absolute" style={{ top: '-40px'}}>
          <Image 
            src="/assets/image/logo_remove.png"
            alt="logo_remove"
            width={300}
            height={100}
            className="drop-shadow-2xl"
            style={{ 
              width: 'auto',
              height: '20vh',
              maxHeight: '240px',
              minHeight: '60px',
            }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
