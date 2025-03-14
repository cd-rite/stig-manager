# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))
import sphinx_rtd_theme


# -- Project information -----------------------------------------------------

project = 'STIG Manager'
copyright = '2025 U.S. Federal Government (in countries where recognized)'
author = 'cd-rite'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
# extensions = [
# ]
extensions = [
    'sphinx_rtd_theme',
    'sphinxcontrib.images',
    'sphinx.ext.todo',
    'myst_parser',    
    'sphinx_tabs.tabs',
    'sphinx_rtd_dark_mode'
]

todo_include_todos = True
# user starts in light or dark mode
default_dark_mode = True

images_config = {
    'override_image_directive': True,
    'default_image_width': '50%',
    'default_group': 'default'
}


# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
# html_theme = 'alabaster'
# html_theme = "pydata_sphinx_theme"
html_theme = "sphinx_rtd_theme"
html_theme_options = {
    'prev_next_buttons_location': 'both',
    # 'logo_only': True,
    'sticky_navigation': True
}

# html_style = 'css/default.css'

github_doc_root = 'https://github.com/cd-rite/stig-manager/tree/readTheDocs/docs'


# html_logo = './_static/images\shield-green-check.svg'
html_logo = 'assets/images/shield-green-check.svg'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# These paths are either relative to html_static_path
# or fully qualified paths (eg. https://...)
html_css_files = [
    'css/custom.css',
    # 'css/custom-pydata-theme.css',
]

html_js_files = [
    'js/custom.js',
]

# html_context = {
# "display_github": True, # Add 'Edit on Github' link instead of 'View page source'
# "last_updated": True,
# "commit": False,
# "github_url": 'https://github.com/cd-rite/stig-manager/tree/readTheDocs/docs'

# }

