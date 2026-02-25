export default function Avatar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_11_7)">
        <rect width="256" height="256" fill="#2C2C32" />
        <g filter="url(#filter0_f_11_7)">
          <path
            d="M128 68C161.137 68 188 94.8629 188 128C188 144.678 181.194 159.766 170.209 170.641L127.568 128L85.3584 170.209C74.6274 159.369 68 144.459 68 128C68 94.8629 94.8629 68 128 68Z"
            fill="#FB923C"
            fill-opacity="0.6"
          />
        </g>
        <g filter="url(#filter1_d_11_7)">
          <path
            d="M128 68C161.137 68 188 94.8629 188 128C188 144.678 181.194 159.766 170.209 170.641L127.568 128L85.3584 170.209C74.6274 159.369 68 144.459 68 128C68 94.8629 94.8629 68 128 68Z"
            fill="#FB923C"
          />
        </g>
        <rect
          x="127.569"
          y="128"
          width="182.032"
          height="181.421"
          transform="rotate(45 127.569 128)"
          fill="#2C2C32"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_11_7"
          x="18"
          y="18"
          width="220"
          height="202.641"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="25"
            result="effect1_foregroundBlur_11_7"
          />
        </filter>
        <filter
          id="filter1_d_11_7"
          x="48"
          y="48"
          width="160"
          height="142.641"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.984314 0 0 0 0 0.572549 0 0 0 0 0.235294 0 0 0 0.6 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_11_7"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_11_7"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_11_7">
          <rect width="256" height="256" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
