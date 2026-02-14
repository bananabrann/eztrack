export default function ToolsManagement() {
   return (
      <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Page Title */}
      <h1 className="text-[#4F5D75] text-3xl font-bold mb-6 flex items-center justify-center">
        Tools Management
      </h1>

      {/* Search Bar Placeholder */}
      <div className=" w-11/12 max-w-md mx-auto mb-6 flex items-center justify-center">
        <input
          type="text"
          placeholder="Search tool..."
          className="w-full border-[#4F5D75] border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#EA5C1F]"
        />
      </div>

      {/* Tools Placeholder Section */}
      <section className="w-10/12 md:w-3/4  max-w-7xl min-w-[600px] mx-auto">
      <div className="border-[#4F5D75] border rounded p-10 text-center text-gray-500">
               <div className="grid grid-cols-2 grid-rows-3 gap-y-8 gap-x-8"
               >
                  {/* <!-- Box 1 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-end w-full bg-gray-100
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 1
                     </div>
                  {/* <!-- Box 2 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-start w-full bg-gray-100
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 2
                     </div>
                  {/* <!-- Box 3 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-end w-full bg-gray-100 
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 3
                     </div>
                  {/* <!-- Box 4 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-start w-full bg-gray-100 
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 4
                     </div>
                  {/* <!-- Box 5 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-end w-full bg-gray-100 
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 5
                     </div>
                  {/* <!-- Box 6 --> */}
                  <div className="py-32 px-12 max-w-md justify-self-start w-full bg-gray-100 
                        rounded border-2 border-transparent hover:border-[#4F5D75]
                        transition-colors hover:shadow-[0_10px_15px_-3px_rgba(79,93,117,0.6)]">
                     Tool 6
                  </div>
               </div>
            </div>
      </section>
    </main>
   );
}