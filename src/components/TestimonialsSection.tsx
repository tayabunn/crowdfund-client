import React from "react";

type Testimonial = {
  id: string | number;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
};

type RowData = {
  id: string | number;
  speed: string;
  direction: "left" | "right";
  testimonials: Testimonial[];
};

type TestimonialsData = {
  title: string;
  subtitle: string;
  rows: RowData[];
};

type TestimonialsSectionProps = {
  data: TestimonialsData;
};

/**
 * TestimonialCard
 */
export const TestimonialCard = ({ quote, authorName, authorTitle, avatarUrl }: Omit<Testimonial, 'id'>) => {
  return (
    <div className="testimonial-card flex flex-col items-start justify-between p-6 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-primary/20 transition-all w-96 flex-shrink-0">
      <p className="text-gray-600 text-base italic leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4 mt-6">
        <img
          src={avatarUrl}
          alt={authorName}
          className="w-12 h-12 rounded-full border-2 border-primary/10 object-cover"
        />
        <div>
          <h4 className="text-sm font-bold text-gray-900">{authorName}</h4>
          <p className="text-xs font-semibold text-primary">{authorTitle}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * HorizontalScroller
 */
export const HorizontalScroller = ({ 
  children, 
  speed = "40s", 
  direction = "left" 
}: { 
  children: React.ReactNode; 
  speed?: string; 
  direction?: "left" | "right"; 
}) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  return (
    <div className="w-full overflow-hidden group relative mask-fade">
      <div 
        className={`flex ${animationClass}`} 
        style={{ 
          // @ts-ignore
          "--scroll-duration": speed 
        }}
      >
        <div className="flex items-stretch justify-center gap-8 px-4 py-2">{children}</div>
        <div className="flex items-stretch justify-center gap-8 px-4 py-2" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * TestimonialsSection
 */
export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="testimonials-section relative flex flex-col items-center gap-12 py-20 w-full overflow-hidden bg-gray-50/50">
      <div className="flex flex-col items-center gap-4 text-center z-10 max-w-2xl px-4">
        <h2
          className="text-4xl font-extrabold text-gray-900 leading-tight"
          style={{ 
            opacity: 0, 
            animation: "fadeInUp 0.7s ease-out 0.2s forwards" 
          }}
        >
          {data.title}
        </h2>
        <div className="w-20 h-1 bg-primary rounded-full"></div>
        <p
          className="text-gray-500 text-base max-w-lg mt-2"
          style={{ 
            opacity: 0, 
            animation: "fadeInUp 0.7s ease-out 0.4s forwards" 
          }}
        >
          {data.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6 z-10 w-full max-w-6xl">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 85% 67% at 50% 100%, rgba(2,169,92,0.06) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
    </section>
  );
}
