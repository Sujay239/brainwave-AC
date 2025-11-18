import PlusSvg from "./PlusSvg";

type SectionSvgProps = {
  crossesOffset?: string;
};

const SectionSvg = ({ crossesOffset }: SectionSvgProps) => {
  return (
    <>
      <PlusSvg
        className={`hidden absolute -top-1.25 left-6.25 ${
          crossesOffset && crossesOffset
        } pointer-events-none lg:block xl:left-8.75`}
      />

      <PlusSvg
        className={`hidden absolute -top-0.3125 right-1.5625 ${
          crossesOffset && crossesOffset
        } pointer-events-none lg:block xl:right-2.1875`}
      />
    </>
  );
};

export default SectionSvg;
