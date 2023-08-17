/*
 * This software was developed at the National Institute of Standards and
 * Technology (NIST) by employees of the Federal Government in the course
 * of their official duties. Pursuant to title 17 Section 105 of the
 * United States Code, this software is not subject to copyright protection
 * and is in the public domain. NIST assumes no responsibility whatsoever for
 * its use by other parties, and makes no guarantees, expressed or implied,
 * about its quality, reliability, or any other characteristic.
 */

const FRME_LEGACY_ICON = "sunset"
const FRME_WARNING_ICON = "dash-circle"
const FRME_ERROR_ICON = "exclamation-triangle"
const FRME_SUCCESS_ICON = "check-circle"
const FRME_IMAGE_ICON = "card-image"
const FRME_QUESTIONABLE_ICON = "question-circle"
const FRME_WITHHOLD_ICON = "dash-circle"

const FRME_WARNING_COLOR = "warning"
const FRME_ERROR_COLOR = "danger"
const FRME_NEUTRAL_COLOR = "info"
const FRME_SUCCESS_COLOR  = "success"
const FRME_QUESTIONABLE_COLOR = "secondary"

export const FRME_EXPLANATIONS = {
	long: {
		proprietary_and_open:
		{
			headline: "Proprietary <i>and</i> Interoperable Formats",
			body: "<p>Interoperability is the ability of two or more entities to exchange information and to use the the exchanged information correctly and with minimal loss of accuracy. Standards, in large part, help facilitate interoperability.</p><p>As early as 1986, NIST&mdash;previously named the National Bureau of Standards (NBS)&mdash;released ANSI/NBS-ICST 1-1986. This standardized an open binary file format allowing for encoding of information on a Federal Bureau of Investigation Arrest and Institution Fingerprint Form, FD-249, including fingerprint images and a host of biographical and case identification information. Basic fingerprint features such as minutiae and pattern classification could also be encoded into the record. Because the encoding of this information is standardized and fully documented in a free publication, any vendor can read and write this information.</p><p>Some information that has been encoded about this fingerprint is stored in a manner that is only known to the vendor. If you wanted to change vendors in the future, or submit this print to another agency that uses a different vendor, you would likely need to manually re-encode all these features.</p> <p>It's possible that not all is lost, but deeper investigation is required. As of the 2015 edition of the standard, ANSI/NIST-ITL allows for encodings to be mixed and matched within the same record in a file. This could either mean that the same information is represented in proprietary <strong>and</strong> interoperable formats, or that the two encodings are mutually exclusive. However, because one format is not open and able to be ",
			show_link: true
		},
		proprietary:
		{
			headline: "Proprietary Formats",
			body: "<p>Interoperability is the ability of two or more entities to exchange information and to use the the exchanged information correctly and with minimal loss of accuracy. Standards, in large part, help facilitate interoperability.</p><p>As early as 1986, NIST&mdash;previously named the National Bureau of Standards (NBS)&mdash;released ANSI/NBS-ICST 1-1986. This standardized an open binary file format allowing for encoding of information on a Federal Bureau of Investigation Arrest and Institution Fingerprint Form, FD-249, including fingerprint images and a host of biographical and case identification information. Basic fingerprint features such as minutiae and pattern classification could also be encoded into the record. Because the encoding of this information is standardized and fully documented in a free publication, any vendor can read and write this information.</p><p>However, this record doesn't contain even the basic amount of fingerprint feature interoperability. All information that has been encoded about this fingerprint is stored in a manner that is only known to the vendor. If you wanted to change vendors in the future, or submit this print to another agency that uses a different vendor, you would likely need to manually re-encode all these features.</p>",
			show_link: true
		},
		efs_and_legacy:
		{
			headline: "Extended Feature Set (EFS) <i>and</i> Legacy Interoperable Formats",
			body: "<p>Interoperability is the ability of two or more entities to exchange information and to use the the exchanged information correctly and with minimal loss of accuracy. Standards, in large part, help facilitate interoperability.</p><p>As early as 1986, NIST&mdash;previously named the National Bureau of Standards (NBS)&mdash;released ANSI/NBS-ICST 1-1986. This standardized an open binary file format allowing for encoding of information on a Federal Bureau of Investigation Arrest and Institution Fingerprint Form, FD-249, including fingerprint images and a host of biographical and case identification information. Basic fingerprint features such as minutiae and pattern classification could also be encoded into the record.</p><p>Fast fowarding to 2005, the Scientific Working Group on Friction Ridge Analysis (SWGFAST) identified fingerprint features beyond the those in ANSI/NBS-ICST, which was renamed ANSI/NIST-ITL. The committee's work, dubbed Extended Feature Set (EFS), was merged into the following revision of the ANSI/NIST-ITL standard in 2011.</p><p>EFS defines an open encoding method for dozens of vendor-neutral features fingerprint examiners routinely extract in their work. It goes beyond simple minutiae and classifications, adding concepts like ridge flow maps, quality regions, tonal inversion, orientation, pores, creases, regions of interest, and more. Because the encoding of this information is standardized and fully documented in a free publication, any vendor can read and write this information.</p><p>This record has both EFS feature encodings (from 2011 and beyond), as well as more basic feature encodings that were first defined in 1986. It's possible that a vendor migrated information from the \"legacy\" encoding to the newer EFS encoding, but deeper investigation is required. As of the 2015 edition of the standard, ANSI/NIST-ITL allows for encodings to be mixed and matched within the same record in a file, meaning that information within the same record in two different encodings could be from two different sources. This is uncommon, but technically possible.</p>",
			show_link: true
		},
		efs:
		{
			headline: "Extended Feature Set (EFS)",
			body: "<p>Interoperability is the ability of two or more entities to exchange information and to use the the exchanged information correctly and with minimal loss of accuracy. Standards, in large part, help facilitate interoperability.</p><p>As early as 1986, NIST&mdash;previously named the National Bureau of Standards (NBS)&mdash;released ANSI/NBS-ICST 1-1986. This standardized an open binary file format allowing for encoding of information on a Federal Bureau of Investigation Arrest and Institution Fingerprint Form, FD-249, including fingerprint images and a host of biographical and case identification information. Basic fingerprint features such as minutiae and pattern classification could also be encoded into the record.</p><p>Fast fowarding to 2005, the Scientific Working Group on Friction Ridge Analysis (SWGFAST) identified fingerprint features beyond the those in ANSI/NBS-ICST, which was renamed ANSI/NIST-ITL. The committee's work, dubbed Extended Feature Set (EFS), was merged into the following revision of the ANSI/NIST-ITL standard in 2011.</p><p>EFS defines an open encoding method for dozens of vendor-neutral features fingerprint examiners routinely extract in their work. It goes beyond simple minutiae and classifications, adding concepts like ridge flow maps, quality regions, tonal inversion, orientation, pores, creases, regions of interest, and more. Because the encoding of this information is standardized and fully documented in a free publication, any vendor can read and write this information.</p>",
			show_link: true
		},
		other_open:
		{
			headline: "Legacy Interoperable Formats",
			body: "<p>Interoperability is the ability of two or more entities to exchange information and to use the the exchanged information correctly and with minimal loss of accuracy. Standards, in large part, help facilitate interoperability.</p><p>As early as 1986, NIST&mdash;previously named the National Bureau of Standards (NBS)&mdash;released ANSI/NBS-ICST 1-1986. This standardized an open binary file format allowing for encoding of information on a Federal Bureau of Investigation Arrest and Institution Fingerprint Form, FD-249, including fingerprint images and a host of biographical and case identification information. Basic fingerprint features such as minutiae and pattern classification could also be encoded into the record.</p><p>Fast fowarding to 2005, the Scientific Working Group on Friction Ridge Analysis (SWGFAST) identified fingerprint features beyond the those in ANSI/NBS-ICST, which was renamed ANSI/NIST-ITL. The committee's work, dubbed Extended Feature Set (EFS), was merged into the following revision of the ANSI/NIST-ITL standard in 2011.</p><p>EFS defines an open encoding method for dozens of vendor-neutral features fingerprint examiners routinely extract in their work. It goes beyond simple minutiae and classifications, adding concepts like ridge flow maps, quality regions, tonal inversion, orientation, pores, creases, regions of interest, and more. Because the encoding of this information is standardized and fully documented in a free publication, any vendor can read and write this information.</p><p>This record only contains the more basic feature encodings that were first defined in 1986. It's possible to migrated information from this encoding to the newer EFS encoding without any loss of data. This would allow you to store more information and remain more compatible with newer systems</p>",
			show_link: true
		},
		image:
		{
			headline: "Only Images",
			body: "<p>While interoperable feature encodings have their place, the information stored in them is only as good as the algorithm or examiner that extracted features from the source sample. Sometimes it's desired to save the image itself so that different feature extraction algorithms or different examiners can reprocess an image without recapturing. While there are many familiar image codecs (e.g., JPEG, PNG, TIFF, etc.), these files do not always contain all the information needed by a feature extractor.</p><p>Images stored in ANSI/NIST-ITL compliant records are interoperable. This is because the image codecs supported by ANSI/NIST-ITL are themselves interoperable.</p><p>Any supplemental information you may have encoded <emph>is not</emph> stored in this record. If you spent time marking minutiae, counting ridges, etc., this information is stored in a supplemental file and would not be transferred to another agency if you only provided this record. The storage format for the suppliemental file is almost certainly proprietary, and almost certainly not ANSI/NIST-ITL compliant.</p>",
			show_link: true
		},
		unknown:
		{
			headline: "No or Unknown Data",
			body: "<p>This appears to be an ANSI/NIST-ITL file, but it doesn't appear to contain any friction ridge data. It could contain faces, tattoos, DNA, or many of the other information ANSI/NIST-ITL files can contain&mdash;just not friction ridges.</p><p>Note that some vendors choose to store images and friction ridge metadata in ANSI/NIST-ITL Type 2 and Type 7. These are both \"user-defined\" fields. The purpose of these fields was to allow for exchange of domain-specific information. For instance, the FBI has documented several fields in Type 2 for FBI-specific case information. Decades ago, before ANSI/NIST-ITL standardized storage of latent fingerprint images, the FBI stored latent fingerprint images in Type 7 and released documentation on how to parse them. However, these are USA-specific examples. Since ANSI/NIST-ITL and user-defined fields are used all over the world, we can't make a reasonable effort to parse them in with this tool&mdash;nor should we, since there have been standardized fields to hold all of the friction ridge imagery and metadata available for over a decade.</p><p>That said, it's extremely possible that there's a bug in our code. If you think this is true, please <a href=\"https://github.com/usnistgov/frme/issues/new\" target=\"_blank\">let us know</a>!</p>",
			show_link: true
		},
	},
	short: {
		proprietary_and_open:
		{
			color: FRME_WARNING_COLOR,
			icon: FRME_WARNING_ICON,
			header: "Some Proprietary Data",
			summary: "Proprietary friction ridge metadata exists in this record, but this may be salvageable, since there are <em>also</em> <strong>open</strong> pieces of metadata.",
			details: "You'll need to explore the contents of the record to see if non-proprietary fields are mapped from the proprietary fields or are supplemental information."
		},
		proprietary:
		{
			color: FRME_ERROR_COLOR,
			icon: FRME_ERROR_ICON,
			header: "Proprietary Data",
			summary: "There is <strong>only</strong> proprietary friction ridge metadata in this record!",
			details: "You <em>will</em> have issues being interoperable with systems from other vendors, migrating to a different vendor's system, and more."
		},
		efs_and_legacy:
		{
			color: FRME_NEUTRAL_COLOR,
			icon: FRME_LEGACY_ICON,
			header: "Interoperable Data",
			summary: "This record makes use of the standardized <em>Extended Feature Set</em> for storing features!",
			details: "There are additional <strong>interoperable</strong> pieces of metadata. You'll want to make sure these are all represented in EFS for the best interoperability in the future."
		},
		efs:
		{
			color: FRME_SUCCESS_COLOR,
			icon: FRME_SUCCESS_ICON,
			header: "Interoperable Data",
			summary: "This record makes use of the standardized <em>Extended Feature Set</em> for storing features!",
			details: ""
		},
		other_open:
		{
			color: FRME_NEUTRAL_COLOR,
			icon: FRME_LEGACY_ICON,
			header: "Interoperable Data",
			summary: "Only <strong>interoperable</strong> pieces of friction ridge metadata are stored in this record.",
			details: "However, Extended Feature Set (EFS) is <em>not</em> used. You'll want to re-encode these features in EFS for future compatibility."
		},
		image:
		{
			color: FRME_QUESTIONABLE_COLOR,
			icon: FRME_IMAGE_ICON,
			header: "Only Images",
			summary: "No friction ridge metadata is present.",
			details: "Images <emph>are</emph> interoperable, but no friction ridge metadata is provided alongside the image. If you marked minutiae or other features, they are <strong>not</strong> recorded in an understood way within this record."
		},
		unknown:
		{
			color: FRME_QUESTIONABLE_COLOR,
			icon: FRME_QUESTIONABLE_ICON,
			header: "No Data",
			summary: "No standardized friction ridge images <em>or</em> metadata present.",
			details: "This <em>is</em> an ANSI/NIST-ITL formatted file, but there may be another type of record within, data may be encoded in a completely proprietary or non-complaint manner, or an error may have occurred."
		},
	},
	table: {
		no_data: {
			icon_color: FRME_QUESTIONABLE_COLOR,
			table_color: null,
			icon: FRME_WITHHOLD_ICON,
			message: "This record has no encodings of any type."
		},
		efs:
		{
			present:
			{
				icon_color: FRME_SUCCESS_COLOR,
				table_color: FRME_SUCCESS_COLOR,
				icon: FRME_SUCCESS_ICON,
				message: "The EFS encoding is interoperable."
			},
			omitted:
			{
				icon_color: FRME_ERROR_COLOR,
				table_color: FRME_ERROR_COLOR,
				icon: FRME_ERROR_ICON,
				message: "This file does not use EFS."
			},
			open_present:
			{
				icon_color: FRME_QUESTIONABLE_COLOR,
				table_color: FRME_WARNING_COLOR,
				icon: FRME_WITHHOLD_ICON,
				message: "This file does not have EFS, but it does have another interoperable encoding. Consider updating."
			}
		},
		open:
		{
			present:
			{
				icon_color: FRME_SUCCESS_COLOR,
				table_color: FRME_SUCCESS_COLOR,
				icon: FRME_SUCCESS_ICON,
				message: "This encoding is interoperable. Consider updating to EFS."
			},
			efs_present:
			{
				icon_color: FRME_SUCCESS_COLOR,
				table_color: null,
				icon: FRME_SUCCESS_ICON,
				message: "This interoperable encoding is omitted, but EFS encoding is present, which is also interoperable."
			},
			legacy_present:
			{
				icon_color: FRME_SUCCESS_COLOR,
				table_color: null,
				icon: FRME_SUCCESS_ICON,
				message: "This interoperable encoding is omitted, but Legacy encoding is present, which is also interoperable."
			},
			omitted:
			{
				icon_color: FRME_QUESTIONABLE_COLOR,
				table_color: null,
				icon: FRME_WITHHOLD_ICON,
				message: "This encoding is interoperable, and you don't have any other interoperable encodings."
			},
		},
		legacy:
		{
			present:
			{
				icon_color: FRME_QUESTIONABLE_COLOR,
				table_color: FRME_WARNING_COLOR,
				icon: FRME_LEGACY_ICON,
				message: "This feature encoding is interoperable, but was superceded by EFS in 2011. Consider updating."
			},
			open_present: {
				icon_color: FRME_SUCCESS_COLOR,
				table_color: null,
				icon: FRME_SUCCESS_ICON,
				message: "This interoperable encoding is omitted, but another interoperable encoding is included."
			},
			omitted:
			{
				icon_color: FRME_QUESTIONABLE_COLOR,
				table_color: null,
				icon: FRME_WITHHOLD_ICON,
				message: "This encoding is interoperable, and you don't have any other interoperable encodings."
			},
		},
		proprietary:
		{
			present:
			{
				icon_color: FRME_ERROR_COLOR,
				table_color: FRME_ERROR_COLOR,
				icon: FRME_ERROR_ICON,
				message: "This is a proprietary type."
			},
			omitted:
			{
				icon_color: FRME_SUCCESS_COLOR,
				table_color: null,
				icon: FRME_SUCCESS_ICON,
				message: "This is a proprietary type and it isn't present."
			},
		}

	}
};
