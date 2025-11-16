<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="260" viewBox="0 0 900 260" role="img" aria-label="Coming Soon">
	<defs>
		<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0%" stop-color="#ff7a7a"/>
			<stop offset="50%" stop-color="#ffd47a"/>
			<stop offset="100%" stop-color="#7affc2"/>
		</linearGradient>
		<style>
			text {
				font: 800 72px 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
				fill: url(#gradient);
				letter-spacing: 12px;
			}
			.pulse {
				animation: pulse 2.6s ease-in-out infinite;
				transform-origin: 50% 50%;
			}
			@keyframes pulse {
				0%, 100% { transform: translateY(0) scale(1); opacity: 0.92; }
				50% { transform: translateY(-12px) scale(1.05); opacity: 1; }
			}
		</style>
		<filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
			<feGaussianBlur stdDeviation="10" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<rect width="100%" height="100%" fill="#030712" />
	<g transform="translate(450,140)">
		<text text-anchor="middle" filter="url(#glow)" class="pulse">COMING SOON</text>
	</g>
</svg>
 
 








