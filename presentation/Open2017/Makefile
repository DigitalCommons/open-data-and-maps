
.PHONY: all clean deploy

SRCS := main.beamer.tex main.article.tex main.handout.tex
AUXS := $(SRCS:.tex=.aux)
LOGS := $(SRCS:.tex=.log)
NAVS := $(SRCS:.tex=.nav)
OUTS := $(SRCS:.tex=.out)
PDFS := $(SRCS:.tex=.pdf)
SNMS := $(SRCS:.tex=.snm)
TOCS := $(SRCS:.tex=.toc)
ALL_PDF := $(SRCS:.tex=.pdf)
all: $(ALL_PDF)
$(ALL_PDF): main.tex map-app-popup-screenshot.png 5-star-steps.png ise-logo.jpg

SERVER ?= parecco
SERVER_DIR ?= public_html/subdomains/solidarityeconomics.org/data/
# Define macro for executing commands on the server (here using ssh):
SERVER_CMD = ssh $(SERVER) $(1)
RSYNC := rsync -avz 
HANDOUT_REDIRECTION_SRC := open2017.html
HANDOUT_REDIRECTION_TGT_DIR := open2017/
HANDOUT_REDIRECTION_TGT_HTML := index.html

deploy: $(ALL_PDF)
	@echo "Need to deploy $(ALL_PDF) to somewhere"
	$(call SERVER_CMD,'cd $(SERVER_DIR) && mkdir -p $(HANDOUT_REDIRECTION_TGT_DIR)')
	$(RSYNC) $(HANDOUT_REDIRECTION_SRC) $(SERVER):$(SERVER_DIR)$(HANDOUT_REDIRECTION_TGT_DIR)$(HANDOUT_REDIRECTION_TGT_HTML)

clean:
	-rm $(AUXS) $(LOGS) $(NAVS) $(OUTS) $(PDFS) $(SNMS) $(TOCS)

# run xelatex twice in order to get cross refs resolved.
%.pdf: %.tex
	xelatex $<
	xelatex $<
