import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Use Next.js dynamic behavior for Supabase queries
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      created_at,
      tags,
      profiles ( display_name )
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400">
          Explore Insights
        </h1>
        <p className="text-xl text-slate-400">Discover the latest articles, tutorials, and thoughts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts?.map((post: any) => (
          <Link href={`/${post.slug}`} key={post.id}>
            <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-transform cursor-pointer h-full flex flex-col group border border-white/5 hover:border-emerald-500/30 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {post.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.map((tag: string) => (
                  <span key={tag} className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-500/20 text-blue-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-white/10">
                <span className="font-medium text-slate-300">
                  {post.profiles?.display_name || 'Writer'}
                </span>
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {(!posts || posts.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-500 glass-panel rounded-xl">
            <p className="text-lg">No published posts yet.</p>
            <Link href="/create" className="text-blue-400 hover:text-blue-300 mt-2 inline-block">Be the first to write one!</Link>
          </div>
        )}
      </div>
    </div>
  );
}
