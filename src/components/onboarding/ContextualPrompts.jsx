/**
 * ContextualPrompts — time-of-day greeting + single CTA (Fitts's Law: max 1 primary CTA).
 * Morning → "Head to work?", Evening → "Heading home?", Weekend → "Explore nearby?"
 * Cluster 3: HomeView.
 */
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sun, Sunset, Moon, Coffee } from 'lucide-react'
import { useUser } from '../../context/UserContext'

function getTimeContext() {
  // Mock: use system time
  const hour = new Date().getHours()
  const day = new Date().getDay() // 0=Sun, 6=Sat

  if (day === 0 || day === 6) {
    return {
      icon: Sun,
      greeting: 'Good weekend',
      prompt: 'Explore somewhere new today?',
      cta: 'Find nearby places',
      ctaTo: '/restaurants',
    }
  }
  if (hour >= 5 && hour < 10) {
    return {
      icon: Coffee,
      greeting: 'Good morning',
      prompt: 'Heading to work?',
      cta: 'Navigate to Work',
      ctaTo: '/navigation',
    }
  }
  if (hour >= 10 && hour < 14) {
    return {
      icon: Sun,
      greeting: 'Good morning',
      prompt: 'Looking for lunch?',
      cta: 'Find lunch spots',
      ctaTo: '/restaurants',
    }
  }
  if (hour >= 14 && hour < 18) {
    return {
      icon: Sun,
      greeting: 'Good afternoon',
      prompt: 'Need a coffee break?',
      cta: 'Find cafés nearby',
      ctaTo: '/search?q=café',
    }
  }
  if (hour >= 18 && hour < 22) {
    return {
      icon: Sunset,
      greeting: 'Good evening',
      prompt: 'Heading home?',
      cta: 'Navigate home',
      ctaTo: '/navigation',
    }
  }
  return {
    icon: Moon,
    greeting: 'Good evening',
    prompt: 'Late night craving?',
    cta: 'Find open now',
    ctaTo: '/search?openNow=true',
  }
}

export default function ContextualPrompts() {
  const navigate = useNavigate()
  const { name } = useUser()
  const context = getTimeContext()
  const Icon = context.icon

  return (
    <div className="px-4 pt-5 pb-4 bg-primary-light border-b border-border">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          aria-hidden="true"
        >
          <Icon size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-syne font-semibold text-text-primary text-base">
            {context.greeting}{name ? `, ${name}` : ''}
          </p>
          <p className="text-sm text-text-secondary font-dm mt-0.5">
            {context.prompt}
          </p>
          <button
            onClick={() => navigate(context.ctaTo)}
            className="mt-3 btn-primary text-sm px-4 py-2 self-start"
            style={{ minHeight: '44px' }}
          >
            {context.cta}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
