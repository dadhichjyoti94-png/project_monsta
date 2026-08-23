import { redirect } from 'next/navigation'

export default async function Page({ params }) {
  const { slug = [] } = await params
  const activeSlug = slug[slug.length - 1]

  redirect(`/categories/${activeSlug}`)
}
