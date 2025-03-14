import { Footer } from "./footer";
import { Header } from "./header";
import { SearchForm } from "./search-form";

export const MainLayout = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			{/* モバイル用 */}
			<div className="md:hidden border-b">
				<div className="container mx-auto px-4 py-2">
					<SearchForm />
				</div>
			</div>
			<main className="flex-grow">{children}</main>
			<Footer />
		</div>
	);
};
