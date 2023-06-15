import { NavLink } from "react-router-dom";

function Nav() {
	return (
		<hreader>
			<nav>
				<div>
					<ul>
						<li>
							<NavLink>Co-op Catalog!</NavLink>
						</li>
						<li>
							<NavLink>Games</NavLink>
						</li>
						<li>
							<NavLink>LeaderBoard</NavLink>
						</li>
						<li>
							<NavLink>Login</NavLink>
						</li>
						<li>
							<NavLink>Signup</NavLink>
						</li>
						<li>
							<NavLink>Logout</NavLink>
						</li>
					</ul>
				</div>
			</nav>
		</hreader>
	);
}
