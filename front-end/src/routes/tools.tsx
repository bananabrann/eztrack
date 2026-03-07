export default function Tools() {
	return (
		<div className="flex flex-col gap-6 items-center mt-8">
			<h1 className="text-[--tertiary-color] font-bold text-2xl md:text-3xl lg:text-4xl mb-6 flex items-center justify-center">
				Tools
			</h1>
			<div className="flex w-52 flex-col gap-4">
				<div className="skeleton h-32 w-full"></div>
				<div className="skeleton h-4 w-28"></div>
				<div className="skeleton h-4 w-full"></div>
				<div className="skeleton h-4 w-full"></div>
			</div>
		</div>
	);
}
