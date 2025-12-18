import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/auth';
import {
    Activity,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Github,
    ShieldCheck,
    Zap
} from 'lucide-react';

export default async function LandingPage() {
    const session = await auth();

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10 selection:text-primary">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Activity className="h-5 w-5 text-primary" />
                            <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                        <span>Simple Uptime</span>
                    </div>
                    <nav className="flex gap-4">
                        <Link href="https://github.com/felipevetter/simple-uptime-monitor" target="_blank">
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <Github className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </Link>
                        {session?.user ? (
                            <Link href="/dashboard">
                                <Button size="sm" className="rounded-full px-6">Dashboard</Button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="rounded-full px-6">Sign In</Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8">
                        <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            v1.0 is now live
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                            Downtime happens. <br />
                            <span className="text-primary">Know about it first.</span>
                        </h1>

                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                            Monitor your websites, APIs, and services with precision.
                            Get instant alerts and detailed performance analytics in a beautiful dashboard.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-12 px-8 rounded-full text-base w-full sm:w-auto shadow-lg hover:shadow-primary/25 transition-all">
                                    Start Monitoring Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="https://github.com" target="_blank">
                                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base w-full sm:w-auto">
                                    <Github className="mr-2 h-4 w-4" />
                                    Open Source
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 w-full max-w-5xl mx-auto perspective-1000">
                            <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm shadow-2xl p-4 md:p-6 transform rotate-x-12 transition-transform hover:rotate-0 duration-700 ease-out">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent rounded-xl pointer-events-none"></div>

                                <div className="flex items-center justify-between mb-6 border-b pb-4">
                                    <div className="flex gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                                    </div>
                                    <div className="h-2 w-32 rounded-full bg-muted"></div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="rounded-lg border bg-background p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="h-2 w-20 rounded bg-muted"></div>
                                                <div className="h-5 w-12 rounded-full bg-green-500/10 text-green-500 text-[10px] flex items-center justify-center font-bold">UP</div>
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-bold">{24 * i}ms</span>
                                                <span className="text-xs text-muted-foreground mb-1">latency</span>
                                            </div>
                                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[70%] rounded-full"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Everything you need to stay online
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Simple Uptime Monitor gives you the tools to ensure high availability for your users without the complexity of enterprise tools.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Real-time Checks</h3>
                                <p className="text-muted-foreground">
                                    We verify your site&apos;s availability every 60 seconds from our global edge network, ensuring you know the moment something goes wrong.
                                </p>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Detailed Analytics</h3>
                                <p className="text-muted-foreground">
                                    Visualize response times and uptime history with beautiful, interactive charts. Spot performance degradation before it becomes an outage.
                                </p>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold">Latency History</h3>
                                <p className="text-muted-foreground">Keep a detailed record of your website&apos;s performance. Analyze response times over the last 24 hours to spot degradation trends before they become outages
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 border-t">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Ready to start monitoring?
                                </h2>
                                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                                    Join thousands of developers who trust Simple Uptime to keep their services running smoothly.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href={session?.user?.id ? "/dashboard" : "/login"}>
                                    <Button size="lg" className="rounded-full px-8 h-12">
                                        Create Free Account
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-8">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span>Unlimited checks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t bg-muted/20">
                <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 font-semibold">
                        <Activity className="h-5 w-5 text-primary" />
                        <span>Simple Uptime</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Simple Uptime Monitor. Built with Next.js & Prisma.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy
                        </Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}