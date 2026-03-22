import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '../../core/services/seo';
import { ProductService } from '../../core/services/product';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { LangLinkPipe } from '../../core/pipes/lang-link.pipe';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, ReactiveFormsModule, LangLinkPipe, TranslocoModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {
  private seo = inject(SeoService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  featuredProducts = toSignal(this.productService.getFeaturedProducts());

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLElement>;

  activeTestimonial = signal(0);
  testimonials = [
    {
      id: 1,
      text: "The quality is unmatched. I purchased a wholesale lot for my boutique in Dubai, and my customers are in love with the softness and the intricate designs.",
      author: "Fatima Al-Sayed",
      location: "Dubai, UAE"
    },
    {
      id: 2,
      text: "A true heritage piece. The saffron sands pashmina is my absolute favorite. It feels like wearing a piece of history.",
      author: "Zaid Al-Harbi",
      location: "Riyadh, KSA"
    },
    {
      id: 3,
      text: "Exceptional service and exquisite craftsmanship. The ivory whisper was the perfect addition to my bridal collection.",
      author: "Lina Mansour",
      location: "Abu Dhabi, UAE"
    }
  ];

  newsletterForm: FormGroup;
  isSubmitting = signal(false);
  subscribeSuccess = signal(false);

  constructor() {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.seo.updateTitle('Premium Pashmina Craftsmanship');
    this.seo.updateMetaTags([
      { name: 'description', content: 'AL-MASRAH: Redefining luxury pashmina for the modern connoisseur.' }
    ]);

    // Auto-slide testimonials
    interval(6000).pipe(
      map(() => (this.activeTestimonial() + 1) % this.testimonials.length)
    ).subscribe(next => this.activeTestimonial.set(next));
  }

  scrollCarousel(dir: 'prev' | 'next'): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const scrollAmount = (card?.offsetWidth ?? 320) + gap;
    track.scrollBy({ left: dir === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.subscribeSuccess.set(true);
      this.newsletterForm.reset();

      setTimeout(() => this.subscribeSuccess.set(false), 5000);
    }, 1500);
  }
}
