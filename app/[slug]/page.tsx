import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const slug = (await params).slug;
  const { data: post } = await supabase
    .from('posts')
    .select('title, tags')
    .eq('slug', slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | CloudBlog`,
    description: `Read ${post.title} on CloudBlog`,
    keywords: post.tags,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug;
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      markdown,
      created_at,
      tags,
      profiles ( display_name )
    `)
    .eq('slug', slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto mt-8">
      <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 font-medium transition-colors">
        <ArrowLeft className="mr-2" size={16} />
        Back to Feed
      </Link>
      
      <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-xl">
        <div className="mb-8 border-b border-white/10 pb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center text-slate-400">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
              {post.profiles?.display_name?.charAt(0).toUpperCase() || 'W'}
            </div>
            <div>
              <div className="font-medium text-slate-200">{post.profiles?.display_name || 'Writer'}</div>
              <div className="text-sm">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-img:rounded-xl">
          <ReactMarkdown>{post.markdown}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
