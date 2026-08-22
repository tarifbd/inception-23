export default function LoadingPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fa] px-5 pb-16 pt-32 dark:bg-night-950">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <div className="ui-skeleton h-5 w-44 rounded-md" />
          <div className="ui-skeleton h-16 w-full max-w-xl rounded-lg sm:h-20" />
          <div className="ui-skeleton h-16 w-4/5 max-w-lg rounded-lg sm:h-20" />
          <div className="ui-skeleton h-24 w-full max-w-2xl rounded-lg" />
          <div className="ui-skeleton h-12 w-52 rounded-lg" />
        </div>
        <div className="ui-skeleton mx-auto aspect-square w-full max-w-[560px] rounded-lg" />
      </div>
      <p className="sr-only" role="status">Loading page</p>
    </main>
  );
}
