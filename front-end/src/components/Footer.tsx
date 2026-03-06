export default function Footer() {
	return (
		<footer className="bg-tertiary py-6 border-t border-gray-200 w-full">
			<div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2 md:flex-row md:justify-between md:items-center">
				<ul className="text-sm text-white flex flex-row list-none p-0 m-0">
					<li className="mr-2 font-semibold">Team:</li>
					<li>Cindy</li>
					<li className="before:content-['|'] before:mx-2">Josh</li>
					<li className="before:content-['|'] before:mx-2">Lisa</li>
					<li className="before:content-['|'] before:mx-2">Elvis</li>
					<li className="before:content-['|'] before:mx-2">Ike</li>
					<li className="before:content-['|'] before:mx-2">Fernando</li>
				</ul>
				<p className="text-sm text-white text-center md:text-right">
					© 2026 EzTrack. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
