﻿/**************************************
    Webutler V2.1 - www.webutler.de
    Copyright (c) 2008 - 2011
    Autor: Sven Zinke
    Free for any use
    Lizenz: GPL
**************************************/

(function () {
  CKEDITOR.plugins.add("formchanges", {
    init: function (a) {
      a.addCss(
        "img.cke_radio, img.cke_radio_checked, img.cke_checkbox, img.cke_checkbox_checked {    background-position: center center;    background-repeat: no-repeat;    width: 16px;    height: 16px;}img.cke_radio {    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/radio_off.gif") +
          ");" +
          "}" +
          "img.cke_radio_checked {" +
          "    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/radio_on.gif") +
          ");" +
          "}" +
          "img.cke_checkbox {" +
          "    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/checkbox_off.gif") +
          ");" +
          "}" +
          "img.cke_checkbox_checked {" +
          "    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/checkbox_on.gif") +
          ");" +
          "}" +
          "img.cke_select, img.cke_selects {" +
          "    background-position: center center;" +
          "    background-repeat: no-repeat;" +
          "    width: 100px;" +
          "}" +
          "img.cke_select {" +
          "    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/select.gif") +
          ");" +
          "    height: 19px;" +
          "}" +
          "img.cke_selects {" +
          "    background-image: url(" +
          CKEDITOR.getUrl(this.path + "images/selects.gif") +
          ");" +
          "    height: 47px;" +
          "}"
      );
      a.on("doubleclick", function (b) {
        var c = b.data.element;
        if (c.hasClass("cke_radio") || c.hasClass("cke_radio_checked"))
          b.data.dialog = "radio";
        else if (
          c.hasClass("cke_checkbox") ||
          c.hasClass("cke_checkbox_checked")
        )
          b.data.dialog = "checkbox";
        else if (c.hasClass("cke_select") || c.hasClass("cke_selects"))
          b.data.dialog = "select";
        else return null;
      });
      if (a.contextMenu)
        a.contextMenu.addListener(function (b, c) {
          if (
            b &&
            b.data("cke-real-element-type") == "radiofield" &&
            (b.hasClass("cke_radio") || b.hasClass("cke_radio_checked"))
          )
            return { radio: CKEDITOR.TRISTATE_OFF };
          else if (
            b &&
            b.data("cke-real-element-type") == "checkboxfield" &&
            (b.hasClass("cke_checkbox") || b.hasClass("cke_checkbox_checked"))
          )
            return { checkbox: CKEDITOR.TRISTATE_OFF };
          else if (
            b &&
            b.data("cke-real-element-type") == "selectfield" &&
            (b.hasClass("cke_select") || b.hasClass("cke_selects"))
          )
            return { select: CKEDITOR.TRISTATE_OFF };
          else return null;
        });
    },
    afterInit: function (a) {
      var b = a.dataProcessor,
        c = b && b.dataFilter;
      if (c)
        c.addRules({
          elements: {
            input: function (d) {
              var e = d.attributes;
              switch (e.type) {
                case "radio":
                  if (e.checked)
                    return a.createFakeParserElement(
                      d,
                      "cke_radio_checked",
                      "radiofield",
                      false
                    );
                  else
                    return a.createFakeParserElement(
                      d,
                      "cke_radio",
                      "radiofield",
                      false
                    );
                  break;
                case "checkbox":
                  if (e.checked)
                    return a.createFakeParserElement(
                      d,
                      "cke_checkbox_checked",
                      "checkboxfield",
                      false
                    );
                  else
                    return a.createFakeParserElement(
                      d,
                      "cke_checkbox",
                      "checkboxfield",
                      false
                    );
                  break;
              }
            },
            select: function (d) {
              var e = d.attributes;
              if (e.size >= 2)
                return a.createFakeParserElement(
                  d,
                  "cke_selects",
                  "selectfield",
                  false
                );
              else
                return a.createFakeParserElement(
                  d,
                  "cke_select",
                  "selectfield",
                  false
                );
            },
          },
        });
    },
    requires: ["fakeobjects"],
  });
  CKEDITOR.on("dialogDefinition", function (a) {
    var b = a.data.name,
      c = a.data.definition,
      d = a.editor;
    if (b == "radio") {
      c.onLoad = function () {
        var g = CKEDITOR.dialog.getCurrent();
        g.on("show", function () {
          var j = this;
          j.radioField = false;
          j.editMode = false;
          var h = d.getSelection(),
            i = h.getSelectedElement();
          if (
            i &&
            i.data("cke-real-element-type") &&
            i.data("cke-real-element-type") == "radiofield"
          ) {
            j.editMode = true;
            j.radioField = i;
            i = d.restoreRealElement(j.radioField);
            j.setupContent(i);
            h.selectElement(j.radioField);
          }
        });
      };
      c.onOk = function () {
        var n = this;
        var g = CKEDITOR.dialog.getCurrent(),
          h = g.getValueOf("info", "name"),
          i = g.getValueOf("info", "value"),
          j = g.getValueOf("info", "checked") == true ? true : false,
          k = d.document.createElement("input");
        if (n.editMode) {
          n.radioField.copyAttributes(k, { type: 1, name: 1, value: 1 });
          n.radioField.moveChildren(k);
        }
        k.removeAttribute("_cke_saved_name");
        k.setAttribute("name", h);
        k.setAttribute("value", i);
        var l;
        if (!j) {
          l = "cke_radio";
          k.removeAttribute("checked");
        } else {
          l = "cke_radio_checked";
          k.setAttribute("checked", "checked");
        }
        var m = d.createFakeElement(k, l, "radiofield", false);
        if (!n.editMode) d.insertElement(m);
        else {
          m.replace(n.radioField);
          d.getSelection().selectElement(m);
        }
        return true;
      };
    }
    if (b == "checkbox") {
      c.onLoad = function () {
        var g = CKEDITOR.dialog.getCurrent();
        g.on("show", function () {
          var j = this;
          j.checkboxField = false;
          j.editMode = false;
          var h = d.getSelection(),
            i = h.getSelectedElement();
          if (
            i &&
            i.data("cke-real-element-type") &&
            i.data("cke-real-element-type") == "checkboxfield"
          ) {
            j.editMode = true;
            j.checkboxField = i;
            i = d.restoreRealElement(j.checkboxField);
            j.setupContent(i);
            h.selectElement(j.checkboxField);
          }
        });
      };
      c.onOk = function () {
        var n = this;
        var g = CKEDITOR.dialog.getCurrent(),
          h = g.getValueOf("info", "txtName"),
          i = g.getValueOf("info", "txtValue"),
          j = g.getValueOf("info", "cmbSelected") == true ? true : false,
          k = d.document.createElement("input");
        if (n.editMode) {
          n.checkboxField.copyAttributes(k, { type: 1, name: 1, value: 1 });
          n.checkboxField.moveChildren(k);
        }
        k.removeAttribute("_cke_saved_name");
        k.setAttribute("name", h);
        k.setAttribute("value", i);
        var l;
        if (!j) {
          l = "cke_checkbox";
          k.removeAttribute("checked");
        } else {
          l = "cke_checkbox_checked";
          k.setAttribute("checked", "checked");
        }
        var m = d.createFakeElement(k, l, "checkboxfield", false);
        if (!n.editMode) d.insertElement(m);
        else {
          m.replace(n.checkboxField);
          d.getSelection().selectElement(m);
        }
        return true;
      };
    }
    if (b == "select") {
      function e(g) {
        g = f(g);
        return g ? g.getChildren() : false;
      }
      function f(g) {
        if (g && g.domId && g.getInputElement().$) return g.getInputElement();
        else if (g && g.$) return g;
        return false;
      }
      c.onShow = function () {
        var k = this;
        k.editMode = false;
        delete k.selectBox;
        k.setupContent("clear");
        var g = d.getSelection(),
          h = g.getSelectedElement();
        if (
          h &&
          h.data("cke-real-element-type") &&
          h.data("cke-real-element-type") == "selectfield"
        ) {
          k.editMode = true;
          k.selectBox = h;
          h = d.restoreRealElement(k.selectBox);
          k.setupContent("select", h);
          var i = e(h);
          for (var j = 0; j < i.count(); j++)
            k.setupContent("option", i.getItem(j));
          g.selectElement(k.selectBox);
        }
      };
      c.onOk = function () {
        var g = d.document.createElement("select");
        this.commitContent(g);
        var h, i;
        if (g.getAttribute("size") >= 2) i = "cke_selects";
        else i = "cke_select";
        h = d.createFakeElement(g, i, "selectfield", false);
        if (!this.editMode) d.insertElement(h);
        else {
          h.replace(this.selectBox);
          d.getSelection().selectElement(h);
        }
      };
    }
  });
})();
